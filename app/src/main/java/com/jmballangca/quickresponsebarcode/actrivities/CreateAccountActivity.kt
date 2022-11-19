package com.jmballangca.quickresponsebarcode.actrivities


import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.firebase.firestore.FirebaseFirestore
import com.jmballangca.quickresponsebarcode.R
import com.jmballangca.quickresponsebarcode.databinding.ActivityCreateAccountBinding
import com.jmballangca.quickresponsebarcode.model.Students
import com.jmballangca.quickresponsebarcode.utils.generateQr
import com.jmballangca.quickresponsebarcode.utils.saveImage


class CreateAccountActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCreateAccountBinding
    private lateinit var firestore: FirebaseFirestore
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCreateAccountBinding.inflate(layoutInflater)
        setContentView(binding.root)
        firestore = FirebaseFirestore.getInstance()
        binding.buttonback.setOnClickListener {
            finish()
        }
        val data = intent.getStringExtra("uid")

        binding.buttonCreate.setOnClickListener {
            val firstName = binding.inputFirstname.text.toString()
            val middleName = binding.inputMiddleName.text.toString()
            val lastName = binding.inputLastname.text.toString()
            val idNumber = binding.inputIDNumber.text.toString()
            val pin = binding.inputPin.text.toString()
            val students = Students(firstName, middleName, lastName,idNumber,pin,System.currentTimeMillis())
            if (data != null) {
                createStudent(data,students)
            }
        }

    }

    private fun createStudent(uid: String, students: Students) {
        firestore.collection("Users").document(uid)
            .collection("Students")
            .document(students.studentID!!)
            .set(students)
            .addOnCompleteListener {
                if (it.isSuccessful) {
                    Toast.makeText(this,"Account successfully created!",Toast.LENGTH_SHORT).show()
                    showSuccessDialog(students)
                } else {
                    Toast.makeText(this,"Account Failed!",Toast.LENGTH_SHORT).show()
                }

            }
    }
    private fun showSuccessDialog(students: Students) {
        val view : View = LayoutInflater.from(this).inflate(R.layout.create_account_success,binding.root,false)
        val dialog = MaterialAlertDialogBuilder(this)
        val textFullname : TextView = view.findViewById(R.id.textFullname)
        val textIDNumber : TextView = view.findViewById(R.id.textID)
        val imageQR : ImageView = view.findViewById(R.id.imageQr)
        imageQR.setImageBitmap(generateQr(students.studentID!!))
        textFullname.text = "${students.firstName} ${students.middleName} ${students.lastName}"
        textIDNumber.text = students.studentID

        dialog.setView(view)
            .setCancelable(false)
            .setPositiveButton("Share") { _, _ ->
                saveImage(System.currentTimeMillis().toString(), generateQr(students.studentID)!!)
            }.setNegativeButton("Close") { dialog, _ ->
                dialog.dismiss()
            }.show()
    }


}