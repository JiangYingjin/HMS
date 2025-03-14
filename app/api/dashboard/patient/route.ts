import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'
import { getSession } from '../../../lib/auth'
import { RowDataPacket } from 'mysql2/promise'

export async function GET() {
    try {
        const admin = await getSession()
        if (!admin || admin.Role !== 'patient') {
            return NextResponse.json({ error: '需要患者权限' }, { status: 403 })
        }

        const connection = await pool.getConnection()
        try {
            // 获取患者基本信息
            const [patientInfo] = await connection.execute<RowDataPacket[]>(`
        SELECT p.*, r.RoomType
        FROM Patients p
        LEFT JOIN Rooms r ON p.RoomID = r.RoomID
        WHERE p.PatientID = ?
      `, [admin.RelatedID])

            // 获取最近的治疗记录
            const [recentTreatments] = await connection.execute<RowDataPacket[]>(`
        SELECT tr.*, d.Name as DoctorName
        FROM TreatmentRecords tr
        JOIN Doctors d ON tr.DoctorID = d.DoctorID
        WHERE tr.PatientID = ?
        ORDER BY tr.Date DESC
        LIMIT 5
      `, [admin.RelatedID])

            // 获取未来的预约
            const [upcomingAppointments] = await connection.execute<RowDataPacket[]>(`
        SELECT a.*, d.Name as DoctorName
        FROM Appointments a
        JOIN Doctors d ON a.DoctorID = d.DoctorID
        WHERE a.PatientID = ? AND a.Date >= CURDATE()
        ORDER BY a.Date, a.Time
      `, [admin.RelatedID])

            return NextResponse.json({
                patientInfo: patientInfo[0],
                recentTreatments,
                upcomingAppointments
            })

        } finally {
            connection.release()
        }
    } catch (error) {
        console.error('Patient Dashboard API Error:', error)
        return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
    }
} 