from pyscript import document
from skyfield.api import load

def format_ra(ra_angle):
    h, m, s = ra_angle.hms()
    return f"{int(h)}h {int(m)}m {s:.2f}s"

def format_dec(dec_angle):
    sign, d, m, s = dec_angle.signed_dms()
    sign_str = '-' if sign < 0 else ''
    return f"{sign_str}{abs(int(d))}deg {int(m)}' {s:.1f}\""



def parse_time(ra_string):
    pattern = r'(\d+)h (\d+)m ([\d.]+)s'
    match = re.match(pattern, ra_string)
    if match:
        hours, minutes, seconds = match.groups()
        return {'hour': int(hours), 'minute': int(minutes), 'second': float(seconds)}
    else:
        raise ValueError("Invalid RA format")

def parse_coords(dec_string):
    pattern = r'(-?\d+)deg (\d+)' "'" ' (\d+.\d+)"'
    match = re.match(pattern, dec_string)
    if match:
        degrees, minutes, seconds = match.groups()
        return {'deg': int(degrees), 'minute': int(minutes), 'second': float(seconds)}
    else:
        raise ValueError("Invalid Dec format")
        


print(json_data)

def translate_english(event):
    input_text = document.querySelector("#english")
    english = input_text.value

    # Create a timescale and ask the current time.
    ts = load.timescale()
    t = ts.now()

    # Load the JPL ephemeris DE421 (covers 1900-2050).
    planets = load('de421.bsp')
    earth, mars = planets['earth'], planets['mars']

    # What's the position of Mars, viewed from Earth?
    astrometric = earth.at(t).observe(mars)
    ra, dec, distance = astrometric.radec()

    ra_string = format_ra(ra)
    dec_string = format_dec(dec)
    parsed_ra = parse_time(ra_string)
    parsed_dec = parse_coords(dec_string)

    json_data = {
        'time': parsed_ra,
        'coords': parsed_dec,
        'distance_au': distance.au
    }

    output_div = document.querySelector("#output")
    output_div.innerText = str(json_data)

