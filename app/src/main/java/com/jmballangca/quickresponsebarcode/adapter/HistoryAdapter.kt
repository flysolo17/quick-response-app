package com.jmballangca.quickresponsebarcode.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.firebase.ui.firestore.FirestoreRecyclerAdapter
import com.firebase.ui.firestore.FirestoreRecyclerOptions
import com.jmballangca.quickresponsebarcode.R
import com.jmballangca.quickresponsebarcode.model.Attendance
import com.jmballangca.quickresponsebarcode.utils.attendanceCalendarFormat

class HistoryAdapter(val context: Context, options: FirestoreRecyclerOptions<Attendance?>) :  FirestoreRecyclerAdapter<Attendance, HistoryAdapter.HistoryViewHolder>(options)  {


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistoryViewHolder {
        val view  = LayoutInflater.from(context).inflate(R.layout.row_student_timestamp,parent,false)
        return HistoryViewHolder(view)
    }



    private fun displayInOrOut(data : Boolean) : String {
        return if (data) {
            "IN"
        } else {
            "OUT"
        }
    }

    override fun onBindViewHolder(holder: HistoryViewHolder, position: Int, model: Attendance) {
        holder.textDate.text = attendanceCalendarFormat(model.timestamp!!)

        holder.textTimeStamp.text = displayInOrOut(model.inSchool!!)


    }
    class HistoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textDate: TextView = itemView.findViewById(R.id.textDate)
        val textTimeStamp: TextView = itemView.findViewById(R.id.textTimestamp)
    }
}