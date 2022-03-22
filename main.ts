function NotiMainBreached () {
    radio.sendString("MainBreached")
}
input.onButtonPressed(Button.A, function () {
    if (input.buttonIsPressed(Button.B)) {
        basic.pause(1000)
        music.playTone(165, music.beat(BeatFraction.Eighth))
        while (pins.digitalReadPin(DigitalPin.P3) == 1) {
            basic.pause(4000)
        }
    }
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
radio.onReceivedString(function (receivedString) {
    if (receivedString == "NodeBreached") {
        serial.writeLine("Node Detect Intruder")
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
esp8266.init(SerialPin.P1, SerialPin.P0, BaudRate.BaudRate115200)
esp8266.connectWiFi("PandaRouter", "Panda1234")
serial.redirectToUSB()
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
        serial.writeLine("Pintu Tutup")
        strip.showColor(neopixel.hsl(0, 0, 0))
    }
    basic.pause(400)
})
