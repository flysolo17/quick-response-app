package com.jmballangca.quickresponsebarcode.actrivities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.jmballangca.quickresponsebarcode.MainActivity
import com.jmballangca.quickresponsebarcode.R
import com.jmballangca.quickresponsebarcode.databinding.ActivityDashBoardBinding
import com.jmballangca.quickresponsebarcode.databinding.BottomSheetDialogBinding
import com.jmballangca.quickresponsebarcode.model.Attendance
import com.jmballangca.quickresponsebarcode.model.Students
import com.jmballangca.quickresponsebarcode.model.Users
import com.jmballangca.quickresponsebarcode.utils.endOfDay
import com.jmballangca.quickresponsebarcode.utils.setCalendarFormat
import com.jmballangca.quickresponsebarcode.utils.startOfDay
import com.jmballangca.quickresponsebarcode.viewmodel.StudentViewModel
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanIntentResult
import com.journeyapps.barcodescanner.ScanOptions

class DashBoardActivity : AppCompatActivity() {
    private lateinit var firestore : FirebaseFirestore
    private lateinit var binding: ActivityDashBoardBinding
    private lateinit var listAttendance : MutableList<Attendance>
    private lateinit var listStudents : MutableList<Students>
    // Register the launcher and result handler
    private lateinit var viewModel: StudentViewModel
    private lateinit var barcodeLauncher : ActivityResultLauncher<ScanOptions>
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashBoardBinding.inflate(layoutInflater)
        setContentView(binding.root)
        viewModel = ViewModelProvider(this)[StudentViewModel::class.java]
        firestore = FirebaseFirestore.getInstance()
        val id = intent.getStringExtra("uid")
        if (id != null) {
            getSchoolInfo(id)
            getAttendance(id)
            getStudents(id)
        }
        barcodeLauncher = registerForActivityResult(
            ScanContract()
        ) { result: ScanIntentResult ->
            if (result.contents == null) {
                Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show()
            } else {
                if (id != null) {
                    if (checkIfStudentIsExists(result.contents)) {
                        showDialog(id)
                        return@registerForActivityResult
                    }
                    takeAttendance(id,result.contents)
                }
            }
        }

        binding.cardScan.setOnClickListener {
            val options = ScanOptions()
            options.setDesiredBarcodeFormats(ScanOptions.QR_CODE)
            options.setPrompt("Quick Response Attendance QR Code")
            options.setCameraId(0) // Use a specific camera of the device
            options.setBeepEnabled(false)
            options.setBarcodeImageEnabled(true)
            barcodeLauncher.launch(options)
        }
        binding.textDate.text = setCalendarFormat(System.currentTimeMillis())
        binding.buttonCreateAccount.setOnClickListener {
            if (id != null) {
                navigateToCreateAccount(id)
            }
        }
        binding.buttonHistory.setOnClickListener {
            val bottomDialog = BottomSheetDialog(this, R.style.BottomsheetDialogStyle)
            val view : View = LayoutInflater.from(this).inflate(R.layout.bottom_sheet_dialog,binding.root,false)
            view.findViewById<Button>(R.id.buttonLogin).setOnClickListener {
                val studentID = view.findViewById<EditText>(R.id.inputIDNumber).text.toString()
                val pin = view.findViewById<EditText>(R.id.inputPin).text.toString()
                if (id != null) {
                    getStudent(id,studentID,pin)
                }
            }
            bottomDialog.setContentView(view)
            bottomDialog.show()
        }
        binding.cardSettings.setOnClickListener {
            MaterialAlertDialogBuilder(this).setTitle("Logout").setMessage("Are you sure you want to logout?")
                .setPositiveButton("Yes") { dialog,_ ->
                    FirebaseAuth.getInstance().signOut()
                    dialog.dismiss()
                    finish()
                }.setNegativeButton("No") {dialog,_ ->
                    dialog.dismiss()
                }.show()
        }
    }
    private fun getStudent(uid: String, id : String, pin : String) {
        var dataList = mutableListOf<Students>()
        firestore.collection("Users").document(uid).collection("Students")
            .whereEqualTo("studentID" ,id)
            .whereEqualTo("pin",pin)
            .limit(1)
            .get()
            .addOnCompleteListener { task ->
                dataList.clear()
                if (task.isSuccessful) {
                    for (data in task.result) {
                        val students = data.toObject(Students::class.java)
                        dataList.add(students)
                    }
                    if (dataList.size > 0) {
                        navigateToStudentProfile(uid,dataList[0])
                    } else {
                        Toast.makeText(this,"No Student found!",Toast.LENGTH_LONG).show()
                    }
                } else {
                    Toast.makeText(this,"No Student found!",Toast.LENGTH_LONG).show()
                }
            }
    }
    private fun showDialog(uid: String) {
        MaterialAlertDialogBuilder(this)
            .setTitle("No Account yet!")
            .setMessage("Oooops looks like you don't have account yet!")
            .setPositiveButton("Create Account") { dialog, _ ->
                dialog.dismiss()
                navigateToCreateAccount(uid)
            }
            .show()
    }
    private fun checkIfStudentIsExists(studentID: String) : Boolean {
        return listStudents.none { it.studentID.equals(studentID) }

    }
    private fun navigateToStudentProfile(uid: String,students: Students) {

        val intent = Intent(this,StudentProfileActivity::class.java)
        intent.putExtra("uid",uid)
        intent.putExtra("student",students)
        startActivity(intent)
    }


    private fun getSchoolInfo(uid : String) {
        firestore.collection("Users").document(uid)
            .get().addOnSuccessListener {
                if (it.exists()) {
                    val user : Users = it.toObject(Users::class.java)!!
                    binding.textSchoolName.text = user.schoolName
                    if (user.schoolProfile!!.isNotEmpty()) {
                        Glide
                            .with(this)
                            .load(user.schoolProfile)
                            .centerCrop()
                            .into(binding.imageSchoolLogo)
                    }
                }
            }
    }
    private fun navigateToCreateAccount(uid : String) {
        startActivity(Intent(this,CreateAccountActivity::class.java).putExtra("uid",uid))
    }
    private fun takeAttendance(uid: String,studentID : String) {
        firestore.collection("Users").document(uid).collection("Attendance").add(
            Attendance(
                studentID,
                checkIfInSchool(studentID),
                System.currentTimeMillis()
            )
        ).addOnCompleteListener { task ->
            if (task.isSuccessful) {
                Toast.makeText(this,"Success",Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this,"Failed",Toast.LENGTH_SHORT).show()
            }
        }
    }
    private fun checkIfInSchool(studentID: String) : Boolean {
        val data = mutableListOf<Attendance>()
        listAttendance.map { attendance ->
            if (attendance.studentID.equals(studentID)) {
               data.add(attendance)
            }
        }
        return data.size % 2 == 0
    }
    private fun getAttendance(uid : String) {
        listAttendance = mutableListOf()
        firestore.collection("Users").document(uid).collection("Attendance")
            .whereGreaterThan("timestamp", startOfDay(System.currentTimeMillis()))
            .whereLessThan("timestamp", endOfDay(System.currentTimeMillis()))
            .addSnapshotListener { value, error ->
                if (error != null) {
                    Toast.makeText(this,"error fetching attendance..",Toast.LENGTH_LONG).show()
                    return@addSnapshotListener
                }
                if (value != null) {
                    listAttendance.clear()
                    for (data in value.toObjects(Attendance::class.java)) {
                        listAttendance.add(data)
                    }
                }
            }
    }
    private fun getStudents(uid: String) {
        listStudents = mutableListOf()
        firestore.collection("Users").document(uid).collection("Students")
            .addSnapshotListener { value, error ->
                if (error != null) {

                    Toast.makeText(this,"error fetching students..",Toast.LENGTH_LONG).show()
                    return@addSnapshotListener
                }


                if (value != null) {
                    listStudents.clear()
                    for (data in value.toObjects(Students::class.java)) {
                        listStudents.add(data)
                    }
                }
            }
    }
}