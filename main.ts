function NotiMainBreached () {
    radio.sendString("MainBreached")
    esp8266.sendTelegramMessage("5015383270:AAG7rdYAe3gHnLXiWF_MZEs67rWJg-bUH8o", "695144713", "PENCEROBOH PADA PINTU UTAMA")
}
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
input.onButtonPressed(Button.AB, function () {
    basic.pause(2000)
    if (false || false) {
        AlarmStatus = 0
    }
    basic.pause(4000)
})
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
input.onButtonPressed(Button.B, function () {
    basic.pause(600)
    music.playTone(262, music.beat(BeatFraction.Whole))
    if (input.buttonIsPressed(Button.A)) {
        basic.pause(100)
    }
})
function worker () {
    strip.showColor(neopixel.colors(NeoPixelColors.White))
}
let strip: neopixel.Strip = null
let AlarmStatus = 0
AlarmStatus = 0
led.enable(false)
strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)
let ds = DS1302.create(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15)
ds.start()
serial.writeLine("" + ds.getHour() + ":" + ds.getMinute())
esp8266.init(SerialPin.P1, SerialPin.P0, BaudRate.BaudRate115200)
esp8266.connectWiFi("PandaRouter", "Panda1234")
serial.redirectToUSB()
basic.forever(function () {
    serial.writeNumber(AlarmStatus)
    if (pins.digitalReadPin(DigitalPin.P3) == 1) {
        serial.writeLine("Pintu Buka")
        if (AlarmStatus == 1) {
            worker()
            serial.writeLine("Pekerja")
        }
        if (AlarmStatus == 0) {
            intruder()
            serial.writeLine("Pencuri")
        }
    }
    if (pins.digitalReadPin(DigitalPin.P3) == 0) {
        serial.writeLine("Pintu Tutup")
        strip.showColor(neopixel.hsl(0, 0, 0))
    }
    basic.pause(400)
})
control.inBackground(function () {
    basic.pause(2000)
    if (ds.getHour() > 19) {
        AlarmStatus = 0
    }
    if (ds.getHour() < 19) {
        AlarmStatus = 1
    }
})
