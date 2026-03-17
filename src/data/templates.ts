export type MessageCategory = 'aviso' | 'posventa'

export const messageTemplates: Record<MessageCategory, string[]> = {
  aviso: [
  "Hola ${row.Destinatario}, ${saludo}! Te escribimos de Siempre Logística por tu envío de ${row.Cliente}. Pasaremos mañana por ${row.Direccion} entre las ${timeRangeStr}. ¡Gracias por elegirnos!",
  "${saludo} ${row.Destinatario}, ¿cómo estás? Somos Siempre Logística. Mañana estaremos en ${row.Direccion} entre ${timeRangeStr} por tu envío de ${row.Cliente}.",
  "¡${saludo}! ${row.Destinatario}, te contactamos de Siempre Logística. Entregaremos tu pedido de ${row.Cliente} mañana en ${row.Direccion}, entre las ${timeRangeStr}.",
  "${saludo} ${row.Destinatario}! Queríamos avisarte que mañana llevaremos tu envío de ${row.Cliente} a ${row.Direccion}, entre ${timeRangeStr}.",
  "${saludo}, ${row.Destinatario}. De parte de Siempre Logística te avisamos que mañana estaremos en ${row.Direccion}, entre ${timeRangeStr}, con tu paquete de ${row.Cliente}.",
  "Hola ${row.Destinatario}, te saluda Siempre Logística. Mañana pasaremos por ${row.Direccion} entre ${timeRangeStr} para entregarte tu pedido de ${row.Cliente}.",
  "${saludo} ${row.Destinatario}, ¿todo bien? Te avisamos que mañana estaremos en ${row.Direccion}, entre ${timeRangeStr}, entregando tu envío de ${row.Cliente}.",
  "Buenas ${saludo.toLowerCase()} ${row.Destinatario}, desde Siempre Logística te informamos que mañana llevaremos tu pedido de ${row.Cliente} a ${row.Direccion}, entre ${timeRangeStr}.",
  "${saludo} ${row.Destinatario}! Te escribimos de Siempre Logística. Mañana pasaremos por ${row.Direccion}, entre ${timeRangeStr}, para entregar tu envío de ${row.Cliente}.",
  "${saludo} ${row.Destinatario}. Tu envío de ${row.Cliente} está programado para mañana en ${row.Direccion}, entre ${timeRangeStr}. ¡Gracias por tu paciencia!",
  "${saludo}! Te saluda Siempre Logística. ${row.Destinatario}, mañana estaremos en ${row.Direccion} entre ${timeRangeStr} para entregarte el envío de ${row.Cliente}.",
  "Hola ${row.Destinatario}! Te escribimos de Siempre Logística para avisarte que mañana llevaremos tu pedido de ${row.Cliente} a ${row.Direccion}, entre ${timeRangeStr}.",
  "${saludo}, ${row.Destinatario}. Mañana visitaremos ${row.Direccion} entre ${timeRangeStr} con tu entrega de ${row.Cliente}. ¡Que tengas un excelente día!",
  "Te saludamos desde Siempre Logística, ${row.Destinatario}. Mañana entre ${timeRangeStr} estaremos en ${row.Direccion} con tu paquete de ${row.Cliente}.",
  "${saludo}! ${row.Destinatario}, mañana pasaremos por ${row.Direccion}, entre ${timeRangeStr}, con tu pedido de ${row.Cliente}. ¡Nos vemos pronto!",
  "${saludo} ${row.Destinatario}! Queremos avisarte que mañana llegará tu envío de ${row.Cliente} a ${row.Direccion}, entre ${timeRangeStr}.",
  "${saludo} ${row.Destinatario}, te escribimos desde Siempre Logística para avisarte que mañana entregaremos tu pedido de ${row.Cliente} en ${row.Direccion}, entre ${timeRangeStr}.",
  "Hola ${row.Destinatario}! Te avisamos que mañana estaremos en ${row.Direccion}, entre ${timeRangeStr}, con tu paquete de ${row.Cliente}. ¡Saludos de Siempre Logística!"
  ],
  posventa: [
    "Buen dia! Como estas? Como parte de nuestro crecimiento organico les preguntamos a quienes recibieron que les parecio la entrega y la forma de trabajo. Si te sorprendiste, si antes te habian avisado alguna vez por WhatsApp con un rango horario, comentandonos o siguiendonos nos ayudas muchisimo. www.instagram.com/siempre.logistica Desde ya gracias por colaborarnos a seguir creciendo! Que termines bien tu dia!!",
    "Hola ${row.Destinatario}, esperamos que estes muy bien. Desde Siempre Logistica queriamos saber como fue tu experiencia de entrega. Tu opinion nos ayuda a mejorar y a seguir creciendo. Si queres, tambien podes apoyarnos en www.instagram.com/siempre.logistica. Muchas gracias por tu tiempo!",
    "Buenas! Gracias por recibir tu envio de ${row.Cliente}. Nos sirve mucho saber si la entrega fue clara y en horario. Si queres dejarnos tu comentario o seguirnos, nos ayudas un monton: www.instagram.com/siempre.logistica. Gracias por acompanarnos!",
    "Hola! Te escribimos desde Siempre Logistica para preguntarte como te resulto la entrega en ${row.Direccion}. Cada comentario suma para mejorar el servicio. Si te gusto la experiencia, nos ayudas siguiendonos en www.instagram.com/siempre.logistica. Gracias!",
    "Buen dia ${row.Destinatario}! Queremos agradecerte por recibir tu pedido y pedirte una opinion breve sobre la entrega. Nos ayuda mucho para seguir mejorando. Si queres apoyarnos, estamos en www.instagram.com/siempre.logistica. Gracias por tu ayuda!",
    "Hola, como estas? Desde Siempre Logistica estamos mejorando nuestro servicio y tu feedback es clave. Si nos contas como fue la entrega, nos ayudas muchisimo. Tambien podes encontrarnos en www.instagram.com/siempre.logistica. Gracias y que tengas un gran dia!"
  ]
}

export const templates = messageTemplates.aviso
