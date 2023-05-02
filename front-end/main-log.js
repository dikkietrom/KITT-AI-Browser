function mainLog(event, mes) {
    console.log(mes.join(' '))
    try {
        addLog({
            messages: mes
        })
    } catch (error) {
        err(error)
    }
}
