package com.jmballangca.quickresponsebarcode

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import com.jmballangca.quickresponsebarcode.actrivities.DashBoardActivity
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
    private lateinit var auth : FirebaseAuth
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        auth = FirebaseAuth.getInstance()
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
            }
        }
        firestore = FirebaseFirestore.getInstance()
        binding.buttonLogin.setOnClickListener {
            val email = binding.inputEmail.editText?.text.toString()
            val password = binding.inputPassword.editText?.text.toString()
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this,"Invalid email/password",Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            loginFunc(email, password)
        }


    }
    private fun loginFunc(email : String,password : String) {
        auth.signInWithEmailAndPassword(email, password).addOnCompleteListener { task ->
            if (task.isSuccessful) {
                Toast.makeText(this,"Success",Toast.LENGTH_LONG).show()
                val currentUser = task.result.user
                updateUI(currentUser)
            } else {
                Toast.makeText(this,"Failed",Toast.LENGTH_LONG).show()
            }
        }.addOnFailureListener {
            Toast.makeText(this,it.message,Toast.LENGTH_LONG).show()
        }
    }

    private fun updateUI(currentUser : FirebaseUser?) {
        if (currentUser != null) {
            startActivity(Intent(this, DashBoardActivity::class.java).putExtra("uid",currentUser.uid))
        }
    }

    override fun onStart() {
        super.onStart()
        val currentUser: FirebaseUser? = auth.currentUser
        updateUI(currentUser)
    }

}