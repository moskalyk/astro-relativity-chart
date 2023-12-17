import { useRef, useEffect,  useState} from 'react';
import './App.css'

function raDecToEcliptic(ra: any, dec: any) {
  // Placeholder for conversion logic
  return { longitude: ra * 15, latitude: dec }; // RA is in hours, so multiply by 15 to convert to degrees
}

function drawChart(ctx: any, points: any, ascendant: any) {
  // Constants for the chart
  const centerX = 250;
    const centerY = 250;
    const radius = 200;
    const houseAngle = 2 * Math.PI / 12; // 30 degrees

  // Draw the chart background
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  const houseLabels = [
    'Aries', 'Pisces', 'Aquarius', 'Capricorn', 'Sagittarius', 
    'Scorpio', 'Libra', 'Virgo', 'Leo', 
    'Cancer', 'Gemini', 'Taurus', 
  ]

  drawHouseLabels(ctx, 250, 250, 200, houseLabels);

  for (let i = 0; i < 12; i++) {
      const angle = houseAngle * i + ascendant; // Add the ascendant offset
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'black';
      ctx.setLineDash([5, 15]);
      ctx.stroke();
  }

  // // Plot each point
  points.forEach((point: any) => {
      const { raDec, color } = point; // Assuming RA and Dec in degrees

      // Convert RA and Dec to degrees
      const raInDegrees = (raDec.ra_hour + raDec.ra_minute / 60 + raDec.ra_second / 3600) * 15;
      const decInDegrees = raDec.dec_deg + raDec.dec_minute / 60 + raDec.dec_second / 3600;

      // Convert to ecliptic coordinates (this is a simplification)
      const eclipticCoords = raDecToEcliptic(raInDegrees, decInDegrees);

      // Now plot the point on the chart
      plotAstroPoint(ctx, eclipticCoords.longitude, eclipticCoords.latitude, 250, 250, 200, color);

      // const { ra, dec } = point; // Assuming RA and Dec in degrees
      // plotPoint(ctx, ra, dec, centerX, centerY, radius);
  });

}


function plotAstroPoint(ctx: any, eclipticLongitude: any, _: any, centerX: any, centerY: any, radius: any, color: any) {
  // Normalize the longitude to the range [0, 360)
  eclipticLongitude = eclipticLongitude % 360;
  if (eclipticLongitude < 0) eclipticLongitude += 360;

  // Convert ecliptic longitude to radians
  const angle = (eclipticLongitude - 170) * (Math.PI / 180); // Adjusting to start from the left

  // Calculate x and y coordinates on the chart
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  // Plot the point
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = color; // Color for the point
  ctx.fill();
}


const AstroChart = ({ points, ascendant} : any) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas!.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawChart(ctx, points, ascendant);
  }, [points]);

  return <canvas ref={canvasRef} width={500} height={500} />;
};

function drawHouseLabels(ctx: any, centerX: any, centerY: any, radius: any, labels: any) {
    const houseAngle = 2 * Math.PI / 12; // 30 degrees in radians for each house

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black'; // Change as needed for your design
    ctx.font = '16px Arial'; // Change as needed for your design

    for (let i = 0; i < 12; i++) {
        // Subtract 270 degrees (3 * Math.PI / 2 radians) from the angle
        const angle = houseAngle * i - (3.23 * Math.PI / 3);

        // Calculate the label's position
        const x = centerX + (radius + 30) * Math.cos(angle); // 20 is the offset from the circle edge
        const y = centerY + (radius + 30) * Math.sin(angle);

        // Draw the label
        ctx.fillText(labels[i], x, y);
    }
}

function App() {
  const ascendant = Math.PI / 6; // Example value, representing 30 degrees
  const [value, setValue] = useState<any>(1440/2);
  const [points, setPoints] = useState<any>([{
    color: '#c93c00',
    raDec: {
      ra_hour: 17+value,
      ra_minute: 0+value,
      ra_second: 46.43+value,
      dec_deg: -23+value,
      dec_minute: 8+value,
      dec_second: 58.1+value
  }},
  {
    color: 'wheat',
  raDec: {
    ra_hour: 14+value,
    ra_minute: 52+value,
    ra_second: 44.64+value,
    dec_deg: -14+value,
    dec_minute: 11+value,
    dec_second: 12.5+value
}},
{
  color: 'black',
raDec: {
  ra_hour: 18+value,
  ra_minute: 27+value,
  ra_second: 38.12+value,
  dec_deg: -22+value,
  dec_minute: 45+value,
  dec_second: 48+value
}}
    // Add more points as needed
  ]);

  useEffect(()=>{

  }, [value, points])


  useEffect(() => {
    const handleScroll = (_: any) => {
      setValue(value+10)
      let evt = {
        target: {
          value: value+100
        }
      }
      setPoints([{
        color: '#c93c00',
        raDec: {
          ra_hour: 17+Number(evt.target.value)/100,
          ra_minute: 0+Number(evt.target.value)/100,
          ra_second: 46.43+Number(evt.target.value)/100,
          dec_deg: -23+Number(evt.target.value)/100,
          dec_minute: 8+Number(evt.target.value)/100,
          dec_second: 58.1+Number(evt.target.value)/100
      }},
      {
        color: 'wheat',
        raDec: {
          ra_hour: 14+Number(evt.target.value)/100,
          ra_minute: 52+Number(evt.target.value)/100,
          ra_second: 44.64+Number(evt.target.value)/100,
          dec_deg: -14+Number(evt.target.value)/100,
          dec_minute: 11+Number(evt.target.value)/100,
          dec_second: 12.5+Number(evt.target.value)/100
      }},
      {
        color: 'black',
        raDec: {
          ra_hour: 18+Number(evt.target.value)/100,
          ra_minute: 27+Number(evt.target.value)/100,
          ra_second: 38.12+Number(evt.target.value)/100,
          dec_deg: -22+Number(evt.target.value)/100,
          dec_minute: 45+Number(evt.target.value)/100,
          dec_second: 48+Number(evt.target.value)/100
      }},
      ])
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Cleanup the listener when the component unmounts
      window.removeEventListener('scroll', handleScroll);
    };
  }, [value]);

  return (
    <>
      <AstroChart points={points} ascendant={ascendant}/>
      <p style={{color: 'black'}}>mercury</p>
      <p style={{color: 'wheat'}}>venus</p>
      <p style={{color: 'wheat'}}>🌎</p>
      <p style={{color: '#c93c00'}}>mars</p>
    </>
  )
}

export default App
