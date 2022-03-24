function NotiMainBreached () {
    radio.sendString("MainBreached")
}
input.onButtonPressed(Button.A, function () {
    ds.DateTime(
    2022,
    3,
    24,
    4,
    18,
    46,
    0
    )
    serial.writeLine("Current Time : " + ds.getHour() + ":" + ds.getMinute())
    serial.writeLine("Current Date : " + ds.getDay() + "/" + ds.getMonth() + "/" + ds.getYear())
})
function intruder () {
    if (pins.digitalReadPin(DigitalPin.P4) == 1) {
        alarm()
        NotiMainBreached()
        serial.writeLine("INTRUDER DETECTED")
        while (IsThereIntruder >= 1) {
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
    convertToText(0),
    "c5",
    convertToText(0)
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
let SecurityPin = 0
let AlarmStatus = 0
let WorkingTimeOrNot = 0
let IsThereIntruder = 0
let strip: neopixel.Strip = null
let ds: DS1302.DS1302RTC = null
serial.writeLine("____________SYSTEM INITIALIZING____________")
ds = DS1302.create(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15)
ds.start()
led.enable(false)
strip = neopixel.create(DigitalPin.P16, 8, NeoPixelMode.RGB)
esp8266.init(SerialPin.P2, SerialPin.P1, BaudRate.BaudRate115200)
esp8266.connectWiFi("PandaRouter", "Panda1234")
serial.redirectToUSB()
serial.writeLine("Current Time : " + ds.getHour() + ":" + ds.getMinute())
serial.writeLine("Current Date : " + ds.getDay() + "/" + ds.getMonth() + "/" + ds.getYear())
serial.writeLine("____________ATM MACHINE HAS INITIALIZED____________")
loops.everyInterval(500, function () {
    if (pins.digitalReadPin(DigitalPin.P3) == 1) {
        serial.writeLine("Pintu Buka")
        if (WorkingTimeOrNot == 1 && AlarmStatus == 0) {
            worker()
            serial.writeLine("Pekerja")
        }
        if (WorkingTimeOrNot == 1 && AlarmStatus == 1) {
            strip.showColor(neopixel.colors(NeoPixelColors.Purple))
            if (pins.digitalReadPin(DigitalPin.P4) == 0) {
                basic.pause(500)
                if (SecurityPin == 0) {
                    intruder()
                    serial.writeLine("Pencuri - Security Pin Not Entered")
                }
                if (SecurityPin == 1) {
                    worker()
                    serial.writeLine("Owner - Security Pin Entered")
                }
            }
        }
        if (WorkingTimeOrNot == 0 && AlarmStatus == 1) {
            if (SecurityPin == 0) {
                intruder()
                serial.writeLine("Pencuri - Security Pin Not Entered")
            }
            if (SecurityPin == 1) {
                serial.writeLine("Owner - Security Pin Entered")
                worker()
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
        SecurityPin = 0
        if (input.buttonIsPressed(Button.B) && !(input.buttonIsPressed(Button.A))) {
            music.playTone(262, music.beat(BeatFraction.Whole))
            basic.pause(200)
            SecurityPin = 0
            if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                music.playTone(262, music.beat(BeatFraction.Whole))
                basic.pause(200)
                SecurityPin = 0
                if (input.buttonIsPressed(Button.A) && !(input.buttonIsPressed(Button.B))) {
                    music.playTone(262, music.beat(BeatFraction.Whole))
                    basic.pause(200)
                    serial.writeLine("ALARM HAS BEEN DISARMED")
                    music.stopAllSounds()
                    IsThereIntruder = 0
                    AlarmStatus = 0
                    SecurityPin = 1
                }
            }
        }
    }
    if (input.buttonIsPressed(Button.AB)) {
        music.playTone(262, music.beat(BeatFraction.Whole))
        if (pins.digitalReadPin(DigitalPin.P3) == 0) {
            serial.writeLine("Alarm System Activated")
            music.playTone(988, music.beat(BeatFraction.Breve))
            AlarmStatus = 1
            SecurityPin = 0
        }
    }
})
control.inBackground(function () {
    if (ds.getHour() < 19) {
        WorkingTimeOrNot = 1
    }
    if (ds.getHour() > 19) {
        WorkingTimeOrNot = 0
    }
    basic.pause(5000)
})
