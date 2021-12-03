
export let darkMode = {
    color: '#fff', 
    fontSize: '40px', 
    fontWeight: '400',
}

export let barPlaceholderData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
        label: "Scatter Dataset",
        data: [10, 13, 5, 7, 14, 25],
        fill: true,
        backgroundColor: "DarkOliveGreen",},{
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        backgroundColor: "GoldenRod",}
    ]
}

export let scatterPlaceholderData = {
    datasets: [{
        label: "Scatter Dataset",
        data: [
            {x: 2, y: 10}, {x: 3, y: 15},{x: 5, y: 13},{x: 13, y: 25},{x: 10, y: 22},
            {x: 7, y: 18},{x: 9, y: 19},{x: 10, y: 16},{x: 11, y: 21},{x: 16, y: 26},
            {x: 14, y: 16},{x: 7, y: 20},{x: 13, y: 24},{x: 17, y: 27},{x: 15, y: 31},
        ],
        backgroundColor: "LightCoral",
        borderColor: "IndianRed",
        },
    ]
}
