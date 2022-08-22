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
const is_admin = (admin === "1") ? true : false

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
let routine, notifications;

const setup = () => {
	if(localStorage.getItem('classnotifications_local') === null) {
		notifications = []
		localStorage.setItem('classnotifications_local', JSON.stringify(notifications))
	} else {
		notifications = JSON.parse(localStorage.getItem('classnotifications_local'))
	}
	
	if (localStorage.getItem('classroutine_local') === null) {
		routine = {
			"sunday": [],
			"monday": [],
			"tuesday": [],
			"wednesday": [],
			"thursday": [],
			"friday": [],
			"saturday": [],
		}
		localStorage.setItem('classroutine_local', JSON.stringify(routine))
	} else {
		routine = JSON.parse(localStorage.getItem('classroutine_local'))
	}
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
		routine[day].sort((a,b) => parseInt(a.time) - parseInt(b.time))
		html = ``
		routine[day].forEach(period => {
			html += `<p><b>${period.time}</b> - ${period.course}  <button id="${period._id}" onclick="handle_remove_period(this.id)" ${is_admin ? '' : 'style="display: none;"'}>-</button><br></p>`
		})
		data_row.append($('<td>').attr('id', `${day}_td`).html(`
            ${html}
            <br> <button class="add_button" id="${day}" onclick="show_add_period(this)" ${is_admin ? '' : 'style="display: none;"'}>+</button>
        `))
	})
}

const handle_remove_period = (id) => {
	DAYS.forEach(day => {
		routine[day] = routine[day].filter(obj => obj._id !== id)
	})
	localStorage.setItem('classroutine_local', JSON.stringify(routine))
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
	localStorage.setItem('classroutine_local', JSON.stringify(routine))
	populate_table_data()
	$(".popup-overlay, .popup-content").removeClass("active");
	$(`#submit-button`).prop('disabled', false)
}

//populate_table_data()

document.addEventListener('DOMContentLoaded', e => {
	setup()
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
