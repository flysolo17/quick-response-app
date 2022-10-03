package com.jmballangca.quickresponsebarcode.model

import java.util.*

data class Attendance(
    val subjectId : String ? = null,
    val teacher : String? = null,
    val attendees : List<Users> = mutableListOf(),
    val createdAt : Date ?= null,
)
