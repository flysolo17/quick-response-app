package com.jmballangca.quickresponsebarcode

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FirebaseFirestore
import com.jmballangca.quickresponsebarcode.databinding.ActivityMainBinding
import com.jmballangca.quickresponsebarcode.model.Attendance
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanIntentResult
import com.journeyapps.barcodescanner.ScanOptions





class MainActivity : AppCompatActivity() {
    private  lateinit var  binding : ActivityMainBinding
    private  lateinit var firestore: FirebaseFirestore

    // Register the launcher and result handler
    private lateinit var barcodeLauncher : ActivityResultLauncher<ScanOptions>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        barcodeLauncher = registerForActivityResult(
            ScanContract()
        ) { result: ScanIntentResult ->
            if (result.contents == null) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(
                    this,
                    "Scanned: " + result.contents,
                    Toast.LENGTH_LONG
                ).show()
                binding.attendanceCode.editText?.setText(result.contents)

            }
        }
        firestore = FirebaseFirestore.getInstance()
        binding.button.setOnClickListener {
            val input = binding.attendanceCode.editText?.text.toString()
            if (input.isEmpty()) {
                binding.attendanceCode.error = "enter code"
            } else {
                getAttendanceCode(input)
            }

        }
        binding.buttonScan.setOnClickListener{
            val options = ScanOptions()
            options.setDesiredBarcodeFormats(ScanOptions.QR_CODE)
            options.setPrompt("Quick Response Attendance QR Code")
            options.setCameraId(0) // Use a specific camera of the device
            options.setBeepEnabled(false)

            options.setBarcodeImageEnabled(true)
            barcodeLauncher.launch(options)
        }
    }
    private fun getAttendanceCode(code : String) {
        firestore.collection("Attendance")
            .document(code)
            .get()
            .addOnSuccessListener {
                if (it.exists()) {
                    val attendance = it.toObject(Attendance::class.java)
                    if (attendance != null) {
                        startActivity(Intent(this,AttendanceScanner::class.java).putExtra("id",it.id))
                    }

                } else {
                    Toast.makeText(this,"Attendance does not exists!",Toast.LENGTH_LONG).show()
                }
            }
    }

}