// scrape routine.json and display it in the table
/*
$.getJSON("routine.json", function (data) {
    var table = $("#table-body");
    for (var day in data) {
        var row = $("<tr>");
        row.append($("<th>").text(day));
        for (var time in data[day]) {
            // s append break after every word in the string
            var text = data[day][time].split(" ").join("</br>");
            row.append($("<td>").html(text));
        }

        // if 2 consecutive same values, then merge them
        var prev = row.children().eq(1).text();
        for (var i = 2; i < row.children().length; i++) {
            var curr = row.children().eq(i).text();
            if (prev == curr) {
                row.children().eq(i).remove();
                row.children().eq(i - 1).attr("colspan", 2);
            } else {
                prev = curr;
            }
        }
        table.append(row);
    }
    
});
*/

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const routine = {
    "sunday": [
        
    ],
    "monday": [
        
    ],
    "tuesday": [
        
    ],
    "wednesday": [
        
    ],
    "thursday": [
        
    ],
    "friday": [
        
    ],
    "saturday": [
        
    ],
}

let current_day = "sunday"

const uid = () => {
    return (Math.random() + 1).toString(36).substring(2)
}

const populate_table_data = () => {
    //console.log(firebaseConfig)
    let data_row = $('#classes')
    data_row.empty()
    DAYS.forEach(day => {
        html = ``
        routine[day].forEach(period => {
            html += `<p><b>${period.time}</b> - ${period.course} - <button id="${period._id}" onclick="handle_remove_period(this.id)">-</button><br></p>`
        })
        data_row.append($('<td>').attr('id', `${day}_td`).html(`
            ${html}
            <br> <button class="add_button" id="${day}" onclick="show_add_period(this)">+</button>
        `))
    })
}

const handle_remove_period = (id) => {
    DAYS.forEach(day => {
        routine[day] = routine[day].filter(obj => obj._id !== id)
    })
    populate_table_data()
}

const show_add_period = (e) => {
    current_day = e.id
    $(".popup-overlay, .popup-content").addClass("active");
    console.log(e)
}

const handle_add_period = (e) => {
    e.preventDefault()
    $(`#submit-button`).prop('disabled', true)
    // $("#add_form").serializeArray()
    let period_obj = {
        "course": e.target.elements.course.value,
        "time": e.target.elements.time.value,
        "_id": uid()
    }
    console.log(period_obj)
    routine[current_day].push(period_obj)
    populate_table_data()
    $(".popup-overlay, .popup-content").removeClass("active");
    $(`#submit-button`).prop('disabled', false)
}

//populate_table_data()

document.addEventListener('DOMContentLoaded', e => {
    populate_table_data()
})

$("#add_form").on('submit', handle_add_period);

//appends an "active" class to .popup and .popup-content when the "Open" button is clicked
$(".open").on("click", function () {
    $(".popup-overlay, .popup-content").addClass("active");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
$(".close").on("click", function () {
    $(".popup-overlay, .popup-content").removeClass("active");
});
