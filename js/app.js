/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    var model = {
        getAttendance() {
            return JSON.parse(localStorage.attendance);
        },
        changeAttendance(newAttendance) {
            localStorage.attendance = JSON.stringify(newAttendance);
        }
    }

    var controller = {
        getAttendance() {
            return model.getAttendance();
        },
        changeAttendance(newAttendance) {
            model.changeAttendance(newAttendance);
        },
        init() {
            view.init();
        }
    }

    var view = {
        init() {
            this.$allMissed = $('tbody .missed-col');
            this.$allCheckboxes = $('tbody input');

            // When a checkbox is clicked, update localStorage
            this.$allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                    $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                view.countMissing();
                controller.changeAttendance(newAttendance);
            });

            view.render();
        },
        render() {
            var attendance = controller.getAttendance();
            // Check boxes, based on attendace records
            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });

            view.countMissing();
        },

        // Count a student's missed days
        countMissing() {
            this.$allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        }
    }

    controller.init();

}());
