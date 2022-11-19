package com.jmballangca.quickresponsebarcode.actrivities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.firebase.ui.firestore.FirestoreRecyclerOptions
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.jmballangca.quickresponsebarcode.R
import com.jmballangca.quickresponsebarcode.adapter.HistoryAdapter
import com.jmballangca.quickresponsebarcode.databinding.ActivityStudentProfileBinding
import com.jmballangca.quickresponsebarcode.model.Attendance
import com.jmballangca.quickresponsebarcode.model.Students
import com.jmballangca.quickresponsebarcode.utils.generateQr
import com.jmballangca.quickresponsebarcode.utils.saveImage
import com.jmballangca.quickresponsebarcode.viewmodel.StudentViewModel

class StudentProfileActivity : AppCompatActivity() {

    private lateinit var binding : ActivityStudentProfileBinding
    private lateinit var firestore: FirebaseFirestore
    private lateinit var historyAdapter: HistoryAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityStudentProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)
        firestore = FirebaseFirestore.getInstance()
        val uid = intent.getStringExtra("uid")
        val students = intent.getParcelableExtra<Students>("student")
        if (uid != null && students != null) {
            historyAdapter = HistoryAdapter(this,getAttendance(uid,students.studentID!!))
            displayInfo(students)
            binding.buttonShareQr.setOnClickListener {
                saveImage(System.currentTimeMillis().toString(), generateQr(students.studentID)!!)
            }
        }
        binding.recyclerviewHistory.apply {
            layoutManager = LinearLayoutManager(binding.root.context)
            adapter = historyAdapter
            addItemDecoration(DividerItemDecoration(binding.recyclerviewHistory.context, DividerItemDecoration.VERTICAL))
        }
        binding.buttonEdit.setOnClickListener {
            val bottomDialog = BottomSheetDialog(this, R.style.BottomsheetDialogStyle)
            val view : View = LayoutInflater.from(this).inflate(R.layout.edit_profile,null,false)
            if (students != null) {
                view.findViewById<EditText>(R.id.inputIDNumber).setText(students.studentID)
                view.findViewById<EditText>(R.id.inputFirstname).setText(students.firstName)
                view.findViewById<EditText>(R.id.inputMiddleName).setText(students.middleName)
                view.findViewById<EditText>(R.id.inputLastname).setText(students.lastName)
                view.findViewById<EditText>(R.id.inputPin).setText(students.pin)
            }

            bottomDialog.setContentView(view)
            bottomDialog.show()
            view.findViewById<Button>(R.id.buttonLogin).setOnClickListener {
                val firstName = view.findViewById<EditText>(R.id.inputFirstname).text.toString()
                val middleName = view.findViewById<EditText>(R.id.inputMiddleName).text.toString()
                val lastName = view.findViewById<EditText>(R.id.inputLastname).text.toString()
                val pin = view.findViewById<EditText>(R.id.inputPin).text.toString()
                if (firstName.isNotEmpty() || middleName.isNotEmpty() || lastName.isNotEmpty() || pin.isNotEmpty()) {
                    val students = Students(firstName,middleName,lastName,students!!.studentID,pin,System.currentTimeMillis())
                    if (uid != null) {
                        update(uid,students)
                    }
                }
            }
        }

    }
    private fun update(uid: String,students: Students) {
        firestore.collection("Users")
            .document(uid)
            .collection("Students")
            .document(students.studentID!!)
            .set(students).addOnCompleteListener {
                if (it.isSuccessful) {
                    Toast.makeText(this,"Successfully Updated",Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    Toast.makeText(this,"Profile Update Failed!",Toast.LENGTH_LONG).show()
                }
            }.addOnFailureListener {
                Toast.makeText(this,it.message,Toast.LENGTH_LONG).show()
            }
    }
    private fun displayInfo(students: Students) {
        binding.textFullname.text = students.firstName + " " + students.middleName + " " + students.lastName
        binding.textIdNumber.text = students.studentID
        binding.imageStudentQr.setImageBitmap(generateQr(students.studentID!!))
    }

    private fun getAttendance(uid: String, studentID : String): FirestoreRecyclerOptions<Attendance?> {
        val query: Query = firestore
            .collection("Users")
            .document(uid)
            .collection("Attendance")
            .whereEqualTo("studentID",studentID)
            .orderBy("timestamp",Query.Direction.DESCENDING)
        return FirestoreRecyclerOptions.Builder<Attendance>()
            .setQuery(query, Attendance::class.java)
            .build()
    }

    override fun onStart() {
        super.onStart()
        historyAdapter.startListening()
    }

    override fun onDestroy() {
        super.onDestroy()
        historyAdapter.startListening()
    }

    override fun onResume() {
        super.onResume()
        historyAdapter.startListening()
    }

}