function displayConfigTable() {
    document.getElementById('boardId').value = result.boardId
    document.getElementById('dailyPeopleSize').value = result.dailyPeopleSize
    document.getElementById('numberOfRandom').value = result.numberOfRandom
    document.getElementById('notifyTime').value = result.notifyTime?.substring(0, 5) || ''
    document.getElementById('scheduleTime').value = result.scheduleTime?.substring(0, 5) || ''
    document.getElementById('lat').value = result.lat
    document.getElementById('long').value = result.long
    document.getElementById('region').value = result.region
    document.getElementById('district').value = result.district
    document.getElementById('scheduleEnableWeekdayOnly').checked = result.scheduleEnableWeekdayOnly
    document.getElementById('scheduleEnableNotHoliday').checked = result.scheduleEnableNotHoliday
}

async function apiGetConfig() {
    result = await fetch(`${publicUrl}/api/alertId/${alertId}`).then(res => res.json())
}

async function getNewConfigAndDisplayConfigTable() {
    await apiGetConfig()
    await readRestaurantListAndUpdateTable()
    displayConfigTable()
}

async function updateConfigTable(id) {
    const payload = {
        id: alertId,
        boardId: document.getElementById('boardId').value,
        dailyPeopleSize: document.getElementById('dailyPeopleSize').value,
        numberOfRandom: document.getElementById('numberOfRandom').value,
        notifyTime: document.getElementById('notifyTime').value == '' ? null : document.getElementById('notifyTime').value + ":00",
        scheduleTime: document.getElementById('scheduleTime').value == '' ? null : document.getElementById('scheduleTime').value + ":00",
        lat: document.getElementById('lat').value,
        long: document.getElementById('long').value,
        region: document.getElementById('region').value,
        district: document.getElementById('district').value,
        scheduleEnableWeekdayOnly: document.getElementById('scheduleEnableWeekdayOnly').checked,
        scheduleEnableNotHoliday: document.getElementById('scheduleEnableNotHoliday').checked
    }
    await fetch(`${publicUrl}/api/alertId/${alertId}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(payload)
    })
    await getNewConfigAndDisplayConfigTable(id)
}

let restaurantTableOnEditId
let isRestaurantTableInputFocusOut = false

function restaurantTableOnEdit({id, displayId}) {
    isRestaurantTableInputFocusOut = false
    // first calling method
    if (restaurantTableOnEditId == null) {
        restaurantTableOnEditId = {id, displayId}
        return
    }

    // same row, no action
    if (restaurantTableOnEditId.id == id) {
        return;
    }

    // different row, save changes
    if (restaurantTableOnEditId.id != id) {
        void updateRestaurant(restaurantTableOnEditId, {
            restaurant: document.getElementById(`${restaurantTableOnEditId.displayId}-restaurant`).value,
            weight: document.getElementById(`${restaurantTableOnEditId.displayId}-weight`).value,
            peopleLimit: document.getElementById(`${restaurantTableOnEditId.displayId}-peopleLimit`).value
        })
        restaurantTableOnEditId = {id, displayId}
    }
}

let blurTimeout

function inputBlur({id, displayId}) {
    isRestaurantTableInputFocusOut = true
    if (blurTimeout != null) clearTimeout(blurTimeout)
    blurTimeout = setTimeout(async () => {
        if (isRestaurantTableInputFocusOut) {
            restaurantTableOnEditId = null
            await updateRestaurant({id, displayId}, {
                restaurant: document.getElementById(`${displayId}-restaurant`).value,
                weight: document.getElementById(`${displayId}-weight`).value,
                peopleLimit: document.getElementById(`${displayId}-peopleLimit`).value
            })

            clearTimeout(blurTimeout)
            blurTimeout = null
        }
    }, 500)
}

function displayRestaurantTable(params) {
    const totalWeight = restaurantList.reduce((pv, cv) => pv + cv.weight, 0)

    if (params == null) {
        const ele = document.querySelector('#tbody')
        ele.innerHTML = [...restaurantList.map(e => `
                <tr>${[...Object.entries(e).map(([k, v]) => {
            if (!['restaurant', 'weight', 'peopleLimit'].includes(k)) return
            return `<input value="${v}" onclick="restaurantTableOnEdit({id: ${e.id}, displayId: ${e.displayId}})" onblur="inputBlur({id: ${e.id}, displayId: ${e.displayId}})" id="${e.displayId}-${k}"/>${k == 'weight' ? `<span class='percentage' id='${e.displayId}-percentage'>${(Math.round(v / totalWeight * 10000) / 100).toFixed(2).padStart(5, ' ')}%</span>` : ''}`
        }).filter(e => e != null), `
                <button type="button" class="btn btn-danger btn-sm" onclick="removeRestaurant(${e.id})">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            `].map(k => `<td>${k}</td>`).join('')}</tr>`), `
                    <tr>
                        <td colspan="4">
                            <button onclick="addRestaurant()" type="button" class="btn btn-primary">
                                <i class="bi bi-plus"></i>
                            </button>
                        </td>
                    </tr>
            `].join('')
    } else {
        console.log(restaurantList, params.displayId)
        const restaurant = restaurantList.find(e => e.displayId == params.displayId)

        document.getElementById(`${restaurant.displayId}-restaurant`).value = restaurant.restaurant
        document.getElementById(`${restaurant.displayId}-weight`).value = restaurant.weight
        document.getElementById(`${restaurant.displayId}-peopleLimit`).value = restaurant.peopleLimit
        for (const key of ['restaurant', 'weight', 'peopleLimit']) {
            const ele = document.getElementById(`${restaurant.displayId}-${key}`)
            ele.onclick = () => restaurantTableOnEdit({id: restaurant.id, displayId: restaurant.displayId})
            ele.onblur = () => inputBlur({id: restaurant.id, displayId: restaurant.displayId})
        }

        restaurantList.forEach((el) => {
            document.getElementById(`${el.displayId}-percentage`).innerHTML = (Math.round(el.weight / totalWeight * 10000) / 100).toFixed(2).padStart(5, ' ') + "%"
        })
    }
}

async function readRestaurantListAndUpdateTable(params) {
    restaurantList = await fetch(`${publicUrl}/api/boardId/${result.boardId}`).then(res => res.json())
    displayRestaurantTable(params)
}

async function addRestaurant() {
    if (blurTimeout != null) {
        await new Promise((resolve) => {
            let intervalTimeout
            setInterval(() => {
                if (blurTimeout == null) {
                    if (intervalTimeout != null) clearTimeout(intervalTimeout)
                    return resolve()
                }
            }, 10)
            intervalTimeout = setTimeout(() => {
                resolve()
            }, 1000)
        })
    }
    await fetch(`${publicUrl}/api/boardId/${result.boardId}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            boardId: result.boardId,
            restaurant: "",
            weight: "",
            peopleLimit: -1
        })
    })
    await readRestaurantListAndUpdateTable()
}

async function updateRestaurant(params, payload) {
    console.log(params, payload)
    await fetch(`${publicUrl}/api/id/${params.id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify({boardId: result.boardId, ...payload})
    })
    await readRestaurantListAndUpdateTable(params)
}

async function removeRestaurant(id) {
    await fetch(`${publicUrl}/api/id/${id}`, {
        method: "DELETE"
    })
    await readRestaurantListAndUpdateTable()
}

document.addEventListener('DOMContentLoaded', async () => {
    displayConfigTable()
    await readRestaurantListAndUpdateTable()
})

async function triggerNow(){
    await fetch(`${publicUrl}/api/trigger/alertId/${alertId}`, {
        method: "POST"
    })
}
