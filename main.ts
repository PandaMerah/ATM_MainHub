function NotiMainBreached () {
    radio.sendString("MainBreached")
    esp8266.sendTelegramMessage("5015383270:AAG7rdYAe3gHnLXiWF_MZEs67rWJg-bUH8o", "695144713", "PENCEROBOH PADA PINTU UTAMA")
}
input.onButtonPressed(Button.A, function () {
    music.stopAllSounds()
})
function intruder () {
    if (pins.digitalReadPin(DigitalPin.P4) == 1) {
        alarm()
        NotiMainBreached()
        serial.writeLine("INTRUDER DETECTED")
        while (pins.digitalReadPin(DigitalPin.P3) == 1) {
            strip.showColor(neopixel.colors(NeoPixelColors.Red))
            strip.show()
            basic.pause(100)
            strip.showColor(neopixel.colors(NeoPixelColors.Blue))
            strip.show()
            basic.pause(100)
        }
    }
}
function alarm () {
    serial.writeLine("Alarm system activated")
    music.startMelody([
    "c5",
    "",
    "c5",
    ""
    ], MelodyOptions.ForeverInBackground)
}
function ButtonCheck () {
    if (pins.digitalReadPin(DigitalPin.P5) == 0) {
        music.playTone(165, music.beat(BeatFraction.Eighth))
        if (pins.digitalReadPin(DigitalPin.P11) == 0) {
            music.playTone(165, music.beat(BeatFraction.Eighth))
            basic.pause(1000)
            while (pins.digitalReadPin(DigitalPin.P3) == 1) {
                basic.pause(4000)
            }
        }
    }
    if (pins.digitalReadPin(DigitalPin.P6) == 0) {
        if (pins.digitalReadPin(DigitalPin.P5) == 0) {
        	
        }
    }
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "NodeBreached") {
        serial.writeLine("Node Detect Intruder")
        esp8266.sendTelegramMessage("5015383270:AAG7rdYAe3gHnLXiWF_MZEs67rWJg-bUH8o", "695144713", "PENCEROBOH PADA PINTU LAIN")
        alarm()
        while (true) {
            strip.showColor(neopixel.colors(NeoPixelColors.Red))
            strip.show()
            basic.pause(100)
            strip.showColor(neopixel.colors(NeoPixelColors.Blue))
            strip.show()
            basic.pause(100)
        }
    }
})
function worker () {
    strip.showColor(neopixel.colors(NeoPixelColors.White))
}
let strip: neopixel.Strip = null
let thieve = 0
led.enable(false)
strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)
let ds = DS1302.create(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15)
ds.start()
serial.writeLine("" + ds.getHour() + ":" + ("" + ds.getMinute()))
esp8266.init(SerialPin.P1, SerialPin.P2, BaudRate.BaudRate115200)
esp8266.connectWiFi("Panda Router", "Panda1234")
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P3) == 1) {
        serial.writeLine("Pintu Buka")
        if (ds.getHour() > 19) {
            worker()
            serial.writeLine("Pekerja")
        }
        if (ds.getHour() < 19) {
            intruder()
            serial.writeLine("Pencuri")
        }
    }
    if (pins.digitalReadPin(DigitalPin.P3) == 0) {
        strip.clear()
        serial.writeLine("Pintu Tutup")
    }
    ButtonCheck()
    basic.pause(400)
})
