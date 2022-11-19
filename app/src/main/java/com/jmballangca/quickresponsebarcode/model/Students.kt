package com.jmballangca.quickresponsebarcode.model

import android.os.Parcel
import android.os.Parcelable

data class Students(
    val firstName: String ? = null,
    val middleName: String ? = null,
    val lastName: String ? = null,
    val studentID: String ? = null,
    val pin: String? = "0000",
    val createdAt: Long = 0,
) : Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readString(),
        parcel.readString(),
        parcel.readString(),
        parcel.readString(),
        parcel.readString(),
        parcel.readLong()
    )

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(firstName)
        parcel.writeString(middleName)
        parcel.writeString(lastName)
        parcel.writeString(studentID)
        parcel.writeString(pin)
        parcel.writeLong(createdAt)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Students> {
        override fun createFromParcel(parcel: Parcel): Students {
            return Students(parcel)
        }

        override fun newArray(size: Int): Array<Students?> {
            return arrayOfNulls(size)
        }
    }
}