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
    IsThereIntruder = 1
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
let DoorTimer = 0
let SecurityPin = 0
let AlarmStatus = 0
let IsThereIntruder = 0
let strip: neopixel.Strip = null
let WorkingTimeOrNot = 0
led.enable(false)
strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)
let ds = DS1302.create(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15)
ds.start()
esp8266.init(SerialPin.P2, SerialPin.P1, BaudRate.BaudRate115200)
esp8266.connectWiFi("PandaRouter", "Panda1234")
esp8266.initInternetTime(8)
serial.redirectToUSB()
if (esp8266.isWifiConnected()) {
    serial.writeLine("CT -" + esp8266.getHour() + ":" + esp8266.getMinute())
}
loops.everyInterval(1000, function () {
    if (pins.digitalReadPin(DigitalPin.P3) == 1) {
        serial.writeLine("Pintu Buka")
        if (WorkingTimeOrNot == 1 && AlarmStatus == 0) {
            worker()
            serial.writeLine("Pekerja")
        }
        if (WorkingTimeOrNot == 1 && AlarmStatus == 1) {
            basic.pause(2000)
            if (SecurityPin == 0) {
                intruder()
                serial.writeLine("Pencuri - Security Pin Not Entered")
            }
            if (SecurityPin == 1) {
                serial.writeLine("Owner - Security Pin Entered")
            }
        }
        if (WorkingTimeOrNot == 0 && AlarmStatus == 1) {
            basic.pause(2000)
            if (SecurityPin == 0) {
                intruder()
                serial.writeLine("Pencuri - Security Pin Not Entered")
            }
            if (SecurityPin == 1) {
                serial.writeLine("Owner - Security Pin Entered")
            }
        }
    }
    if (pins.digitalReadPin(DigitalPin.P3) == 0) {
        serial.writeLine("Pintu Tutup")
        if (IsThereIntruder == 0) {
            strip.showColor(neopixel.hsl(0, 0, 0))
        }
    }
})
basic.forever(function () {
    if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
        music.playTone(262, music.beat(BeatFraction.Whole))
        basic.pause(200)
        serial.writeLine("Button Pressed")
        if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
            music.playTone(262, music.beat(BeatFraction.Whole))
            basic.pause(200)
            SecurityPin = 0
            serial.writeLine("Button Pressed")
            if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                music.playTone(262, music.beat(BeatFraction.Whole))
                basic.pause(200)
                SecurityPin = 0
                serial.writeLine("Button Pressed")
                if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                    music.playTone(262, music.beat(BeatFraction.Whole))
                    basic.pause(200)
                    serial.writeLine("Button Pressed")
                    SecurityPin = 1
                } else {
                    SecurityPin = 0
                }
            }
        }
    }
    if (input.buttonIsPressed(Button.AB)) {
        DoorTimer = ds.getSecond()
        music.playTone(262, music.beat(BeatFraction.Whole))
        if (pins.digitalReadPin(DigitalPin.P3) == 0 || DoorTimer == ds.getSecond() - 2) {
            AlarmStatus = 1
            SecurityPin = 0
        }
    }
})
control.inBackground(function () {
    if (esp8266.getHour() < 19) {
        WorkingTimeOrNot = 1
    }
    if (esp8266.getHour() > 19) {
        WorkingTimeOrNot = 0
    }
    basic.pause(5000)
})
