package com.jmballangca.quickresponsebarcode.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.jmballangca.quickresponsebarcode.model.Students

class StudentViewModel : ViewModel() {
    private val student = MutableLiveData<Students>()

    fun setStudent(students: Students) {
        student.value = students
    }
    fun getStudent() : LiveData<Students>{
        return student
    }
}