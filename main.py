def on_button_pressed_a():
    music.stop_all_sounds()
input.on_button_pressed(Button.A, on_button_pressed_a)

def intruder():
    if pins.digital_read_pin(DigitalPin.P16) == 1:
        alarm()
        serial.write_line("HUMAN DETECTED")
        while pins.digital_read_pin(DigitalPin.P4) == 1:
            strip.show_color(neopixel.colors(NeoPixelColors.RED))
            strip.show()
            basic.pause(100)
            strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
            strip.show()
            basic.pause(100)
def alarm():
    serial.write_line("Alarm system activated")
    music.start_melody(["c5", "", "c5", ""], MelodyOptions.FOREVER_IN_BACKGROUND)
def worker():
    strip.show_color(neopixel.colors(NeoPixelColors.WHITE))
strip: neopixel.Strip = None
thieve = 0
led.enable(False)
strip = neopixel.create(DigitalPin.P2, 8, NeoPixelMode.RGB)
ds = DS1302.create(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15)
ds.start()
serial.write_line("" + str(ds.get_hour()) + ":" + ("" + str(ds.get_minute())))
esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BAUD_RATE115200)
esp8266.connect_wi_fi("PandaRouter", "Panda1234")

def on_forever():
    if pins.digital_read_pin(DigitalPin.P4) == 1:
        serial.write_line("Pintu Buka")
        if ds.get_hour() > 19:
            worker()
            serial.write_line("Pekerja")
        if ds.get_hour() < 19:
            intruder()
            serial.write_line("Pencuri")
    if pins.digital_read_pin(DigitalPin.P4) == 0:
        strip.clear()
        serial.write_line("Pintu Tutup")
    basic.pause(400)
basic.forever(on_forever)