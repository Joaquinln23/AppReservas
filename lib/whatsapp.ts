export async function sendWhatsAppNotification({
  clientName, clientPhone, serviceName, date, time, notes,
}: {
  clientName: string; clientPhone: string; serviceName: string
  date: string; time: string; notes?: string
}) {
  const token = process.env.FONNTE_TOKEN
  const barberPhone = process.env.BARBER_PHONE
  if (!token || !barberPhone) return { success: false }

  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const msg = `✂️ *NUEVA RESERVA - AgendaPro*\n\n👤 ${clientName}\n📱 ${clientPhone}\n💈 ${serviceName}\n📅 ${formattedDate}\n🕐 ${time}${notes ? `\n📝 ${notes}` : ''}`

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: barberPhone,
        message: msg,
        countryCode: '56',
      }),
    })
    return { success: res.ok }
  } catch {
    return { success: false }
  }
}