function redraw() {
    window.location.href = `${publicUrl || ''}/boardId/${boardId}/seed/${Math.random().toString().slice(2)}/timestamp/${+new Date()}${window.location.search}`
}

function displayRestaurantTable() {
    const ele = document.querySelector('#tbody')
    const totalWeight = restaurantList.reduce((pv, cv) => pv + cv.weight, 0)
    ele.innerHTML = restaurantList.map(e =>
        `<tr>${Object.entries(e)
            .map(([k, v]) => {
                if (!['restaurant', 'weight', 'peopleLimit'].includes(k)) return
                if ('weight' === k) return v + `<span class='percentage'>${(Math.round(v / totalWeight * 10000) / 100).toFixed(2).padStart(5,' ')}%</span>`
                return v
            })
            .filter(e => e != null)
            .map(k => `<td>${k}</td>`)
            .join('')}</tr>`)
        .join('')
}

document.addEventListener("DOMContentLoaded", () => {
    displayRestaurantTable()
})
