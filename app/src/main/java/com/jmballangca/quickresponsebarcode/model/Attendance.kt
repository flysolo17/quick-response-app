package com.jmballangca.quickresponsebarcode.model

import java.util.*

data class Attendance(
    val studentID : String ? = null,
    val inSchool : Boolean? = null,
    val timestamp : Long ? = null,

)
