const chart=document.getElementById('myChart')
const chart2=document.getElementById('myChart2')

let razor=document.getElementById("razor")?.value
let paypal=document.getElementById("paypal")?.value
let cod=document.getElementById("cod")?.value

let razorAm=document.getElementById("razorAm")?.value
let paypalAm=document.getElementById("paypalAm")?.value
let codAm=document.getElementById("codAm")?.value





        const labels = [
          'Razorpay',
          'Paypal',
          'COD',
        ];

        const data = {
          labels: labels,
          datasets: [{
            label: 'Payment type',
            backgroundColor:"rgba(58,123,213,1)",
            borderColor: 'rgb(120, 99, 135)',
            data: [razor, paypal, cod],
            fill:true,
            borderColor:"white",
            pointBackgroundColor:"black"
          }]
        };


        const config = {
          type: 'bar',
          data: data,
          options: {
              responsive:true,
              // radius:5,
              // hoverRadius:12,
              // tension:0.3

          }
        }
    //chart second
    const data2 = {
        labels: labels,
        datasets: [{
          label: 'Sale Amount',
          backgroundColor:"rgba(58,123,213,1)",
          borderColor: 'rgb(120, 99, 135)',
          data: [razorAm, codAm, paypalAm],
          fill:true,
          borderColor:"white",
          pointBackgroundColor:"black"
        }]
      };

      
      const config2 = {
        type: 'line',
        data: data2,
        options: {
            responsive:true,
         

        }
      }

        const myChart = new Chart(chart,config);
        const myChart2 = new Chart(chart2,config2);