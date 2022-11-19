package com.jmballangca.quickresponsebarcode.utils

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.core.content.ContextCompat.startActivity
import com.google.zxing.BarcodeFormat
import com.google.zxing.MultiFormatWriter
import com.google.zxing.common.BitMatrix
import com.journeyapps.barcodescanner.BarcodeEncoder
import java.io.IOException
import java.text.Format
import java.text.SimpleDateFormat
import java.util.*

fun startOfDay(timestamp: Long): Long {
    val cal = Calendar.getInstance()
    val date = Date(timestamp)
    cal.time = date
    cal[Calendar.HOUR_OF_DAY] = 0
    cal[Calendar.MINUTE] = 0
    cal[Calendar.SECOND] = 1
    return cal.timeInMillis
}

fun endOfDay(timestamp: Long): Long {
    val cal = Calendar.getInstance()
    val date = Date(timestamp)
    cal.time = date
    cal[Calendar.HOUR_OF_DAY] = 23
    cal[Calendar.MINUTE] = 59
    cal[Calendar.SECOND] = 59
    return cal.timeInMillis
}
fun setCalendarFormat(timestamp: Long): String? {
    val date = Date(timestamp)
    val format: Format = SimpleDateFormat("MMM dd, yyyy")
    return format.format(date)
}
fun attendanceCalendarFormat(timestamp: Long): String? {
    val date = Date(timestamp)
    val format: Format = SimpleDateFormat("MMM dd, yyyy hh:mm:ss aa")
    return format.format(date)
}
fun Activity.shareImageNow(uri: Uri){
    val intent = Intent(Intent.ACTION_SEND)
    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
    intent.putExtra(Intent.EXTRA_STREAM,uri)
    intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
    intent.type = "image/jpg"
    startActivity(Intent.createChooser(intent,"Share image via"))
}
fun generateQr(qr : String) : Bitmap? {
    var bitmap : Bitmap? = null
    try {
        val writter = MultiFormatWriter()
        val matrix : BitMatrix =writter.encode(qr, BarcodeFormat.QR_CODE,350,350)
        val barcodeEncoder = BarcodeEncoder()
        bitmap = barcodeEncoder.createBitmap(matrix)
    } catch (error :Exception) {
        return bitmap
    }
    return  bitmap
}
fun Activity.saveImage(name : String,bitmap: Bitmap) : Boolean{
    val imageCollection : Uri = if (sdkCheck()){
        MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
    } else {
        MediaStore.Images.Media.EXTERNAL_CONTENT_URI
    }
    val contentValues = ContentValues().apply {
        put(MediaStore.Images.Media.DISPLAY_NAME,"$name.jpg")
        put(MediaStore.Images.Media.MIME_TYPE,"images/jpeg")
        put(MediaStore.Images.Media.WIDTH,bitmap.width)
        put(MediaStore.Images.Media.HEIGHT,bitmap.height)
    }
    return try {
        this.contentResolver.insert(imageCollection,contentValues)?.also {
            this.contentResolver.openOutputStream(it).use { outputStream->
                if (!bitmap.compress(Bitmap.CompressFormat.JPEG,95,outputStream)) {
                    throw IOException("Failed to save bitmap")
                }
            }
            shareImageNow(it)
        }?: throw IOException("Failed to create Media Entry")
        true
    } catch(e: IOException) {
        e.printStackTrace()
        false
    }
}
 fun sdkCheck() : Boolean{
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q){
        return true
    }
    return false
}