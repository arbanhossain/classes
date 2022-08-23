String.fromHtmlEntities = function (string) {
	return (string + "").replace(/&#\d+;/gm, function (s) {
		return String.fromCharCode(s.match(/\d+/gm)[0]);
	})
};

const remove_hidden_char = (s) => {
	s = s.replace(/\\n/g, "\\n")
		.replace(/\\'/g, "\\'")
		.replace(/\\"/g, '\\"')
		.replace(/\\&/g, "\\&")
		.replace(/\\r/g, "\\r")
		.replace(/\\t/g, "\\t")
		.replace(/\\b/g, "\\b")
		.replace(/\\f/g, "\\f")
	// Remove non-printable and other non-valid JSON characters
	s = s.replace(/[\u0000-\u0019]+/g, "");
	return s
}

const is_admin = (admin === "1") ? true : false

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
let routine, notifications;

const setup = () => {
	if (localStorage.getItem('classnotifications_local') === null) {
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
		routine[day].sort((a, b) => parseInt(a.time) - parseInt(b.time))
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

const populate_notifications_data = () => {
	let noti_list = $('#notifications_list')
	noti_list.empty()
	notifications.forEach(noti => {
		noti_list.append($('<li>').html(`<button id="${noti._id}" onclick="handle_remove_notification(this.id)" ${is_admin ? '' : 'style="display: none;"'}>-</button><b>${(new Date(noti.time)).toDateString()}</b>: ${noti.message}`))
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
	$("#routine_modal_overlay, #routine_modal_content").addClass("active");
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
	$("#routine_modal_overlay, #routine_modal_content").removeClass("active");
	$(`#submit-button`).prop('disabled', false)
}

const handle_add_noti = () => {
	let noti = {
		"message": $('#noti_msg').val(),
		"time": new Date(),
		"_id": uid()
	}
	update_notification(noti)
	// notifications.push(noti)
	// localStorage.setItem('classnotifications_local', JSON.stringify(notifications))
	// populate_notifications_data()
	$("#noti_modal_overlay, #noti_modal_content").removeClass("active");
	location.reload()

}

const handle_remove_notification = async (id) => {
	let res = await fetch('/delete_noti', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ _id: id })
	})
	let data = await res.json()
	if (data.redirect) {
		window.location.href = data.redirect;
	}
}

const update_routine = async () => {
	let res = await fetch('/update', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(routine)
	})
	let data = await res.json()
	if (data.redirect) {
		window.location.href = data.redirect;
	}
}

const update_notification = async (noti) => {
	let res = await fetch('/update_noti', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(noti)
	})
	let data = await res.json()
	if (data.redirect) {
		window.location.href = data.redirect;
	}
}

//populate_table_data()

document.addEventListener('DOMContentLoaded', e => {
	$("#add_noti").prop('disabled', !is_admin)
	$("#update_routine_button").prop('disabled', !is_admin)
	routine = JSON.parse(String.fromHtmlEntities(routine_fbase))
	notifications = JSON.parse(String.fromHtmlEntities(noti_fbase))
	// console.log(routine_fbase)
	// console.log(noti_fbase)
	// setup()
	populate_table_data()
	populate_notifications_data()
})

$("#add_form").on('submit', handle_add_period);

//appends an "active" class to .popup and .popup-content when the "Open" button is clicked
$(".open").on("click", function () {
	$("#routine_modal_overlay, #routine_modal_content").addClass("active");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
$(".close").on("click", function () {
	$("#routine_modal_overlay, #routine_modal_content").removeClass("active");
});

$("#add_noti").on("click", function () {
	$("#noti_modal_overlay, #noti_modal_content").addClass("active");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
$("#close_noti").on("click", function () {
	$("#noti_modal_overlay, #noti_modal_content").removeClass("active");
});
