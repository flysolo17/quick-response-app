package com.jmballangca.quickresponsebarcode

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.zxing.BarcodeFormat
import com.google.zxing.ResultPoint
import com.google.zxing.client.android.BeepManager
import com.jmballangca.quickresponsebarcode.databinding.ActivityAttendanceScannerBinding
import com.jmballangca.quickresponsebarcode.model.Attendees
import com.jmballangca.quickresponsebarcode.model.Users
import com.journeyapps.barcodescanner.BarcodeCallback
import com.journeyapps.barcodescanner.BarcodeResult
import com.journeyapps.barcodescanner.DefaultDecoderFactory


class AttendanceScanner : AppCompatActivity() {

    private lateinit var beepManager: BeepManager
    private var lastText: String? = null
    private lateinit var callback : BarcodeCallback
    private lateinit var binding : ActivityAttendanceScannerBinding
    private lateinit var firestore : FirebaseFirestore
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_CODE) {
            if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                Toast.makeText(this, "Camera Permission Denied!", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAttendanceScannerBinding.inflate(layoutInflater)
        setContentView(binding.root)
        firestore = FirebaseFirestore.getInstance()
        val id = intent.getStringExtra("id")
        callback = object : BarcodeCallback {
            override fun barcodeResult(result: BarcodeResult) {
                if (result.text == null || result.text == lastText) {
                    // Prevent duplicate scans
                    return
                }
                lastText = result.text
                binding.barcodeScanner.setStatusText(result.text)
                checkAttendance(result.text,id!!)
                beepManager.playBeepSoundAndVibrate()
            }

            override fun possibleResultPoints(resultPoints: List<ResultPoint>) {}
        }
        val formats: Collection<BarcodeFormat> =
            mutableListOf(BarcodeFormat.QR_CODE, BarcodeFormat.QR_CODE)
        binding.barcodeScanner.decoderFactory = DefaultDecoderFactory(formats)
        binding.barcodeScanner.initializeFromIntent(intent)
        binding.barcodeScanner.decodeContinuous(callback)
        beepManager = BeepManager(this)
        beepManager.isBeepEnabled = true
        beepManager.isVibrateEnabled = true
    }
    override fun onResume() {
        super.onResume()
        binding.barcodeScanner.resume()
    }

    override fun onPause() {
        super.onPause()
        binding.barcodeScanner.pause()
    }

    private fun checkPermission(permission: String, requestCode: Int) {
        //checking if permission granted or not
        if (ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_DENIED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(permission),
                requestCode
            )
        }
    }

    private fun checkAttendance(userId : String,attendanceCode : String) {
        firestore.collection("Users")
            .document(userId)
            .get()
            .addOnSuccessListener {
                if (it.exists()) {
                    val user = it.toObject(Users::class.java)
                    if (user != null) {
                        if (user.type == "Teacher") {
                            Toast.makeText(this,"this user is not student",Toast.LENGTH_SHORT).show()
                        }
                        val attendee = Attendees(user.id,user.firstName,user.middleName,user.lastName,user.idNumber,System.currentTimeMillis())
                        addAttendee(attendee,attendanceCode)
                    }
                } else {
                    Toast.makeText(this,"user not exists!",Toast.LENGTH_SHORT).show()
                }
            }
    }

    private fun addAttendee(attendee: Attendees, attendanceCode: String) {
        firestore.collection("Attendance")
            .document(attendanceCode)
            .update("attendees",FieldValue.arrayUnion(attendee))
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    Toast.makeText(this,"Attendance success!",Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this,"Invalid Attendance!",Toast.LENGTH_SHORT).show()
                }
            }
    }

    override fun onStart() {
        super.onStart()
        checkPermission(Manifest.permission.CAMERA, CAMERA_PERMISSION_CODE)
    }
    companion object {
        const val CAMERA_PERMISSION_CODE = 223
    }
}