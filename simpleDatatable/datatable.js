class SimpleDataTableWidget{


    constructor(containerID)
    {
        let objName = "dataTableExample";
        // language=HTML
        let dialogs = "\n" +
            "<div class=\"modal fade\" id=\"addRowModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addRowModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"addRowModalTitle\">CREATE STUDENT</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                <div class=\"\">\n" +
            "                    <label for=\"studentNameCreateInput\">Student Name</label>\n" +
            "                    <input required id=\"studentNameCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                    <label for=\"studentNameCreateInput\">Group Name</label>\n" +
            "                    <input  required id=\"groupNameCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                    <label for=\"studentNameCreateInput\">Rating</label>\n" +
            "                    <input required id=\"ratingCreateInput\" type=\"number\" class=\"form-control\">\n" +
            "                    <label for=\"studentNameCreateInput\">Subject Name</label>\n" +
            "                    <input required id=\"subjectNameCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeAddRowModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
            "                <button type=\"button\" class=\"btn btn-primary\" onclick=\"onClickCreateStudent('"+objName+"')\">Create</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "<div class=\"modal fade\" id=\"deleteRowsModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteRowsModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"deleteRowsModalTitle\">DELETE STUDENTS</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                Are you sure you want to delete students?\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeDeleteRowsModalModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n" +
            "                <button type=\"button\" class=\"btn btn-danger\" onclick=\"onClickDeleteStudent('"+objName+"')\">Yes</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "<div class=\"modal fade\" id=\"updateRowModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"updateRowModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"updateRowModalTitle\">UPDATE STUDENT</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                <label for=\"studentNameCreateInput\">Student Name</label>\n" +
            "                <input required id=\"studentNameUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <label for=\"studentNameCreateInput\">Group Name</label>\n" +
            "                <input  required id=\"groupNameUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <label for=\"studentNameCreateInput\">Rating</label>\n" +
            "                <input required id=\"ratingUpdateInput\" type=\"number\" class=\"form-control\">\n" +
            "                <label for=\"studentNameCreateInput\">Subject Name</label>\n" +
            "                <input required id=\"subjectNameUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <input hidden required id=\"keyUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeUpdateRowModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n" +
            "                <button type=\"button\" class=\"btn btn-primary\" onclick=\"onClickUpdateSaveStudent('"+objName+"')\">Save</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n";
        let thisObj = this;
        this.containerID = containerID;
        $("html").append(dialogs);
        this.db = firebase.database();
        this.allStudents = [];
        this.displayStudents = [];
        this.sortField = null;
        this.isDescSort = false;
        this.filter = '';
        this.currentPage = 0;
        this.displayPagesCount = 0;
        this.rowsOnPage = 10;
        this.maxDisplayPages = 10;

        this.studentFields = ['studentName','groupName','subjectName','rating'];

        this.studentRef = this.db.ref('student');
        this.createInputStudentName = $('#studentNameCreateInput');
        this.createInputGroupName = $('#groupNameCreateInput');
        this.createInputRating = $('#ratingCreateInput');
        this.createInputSubjectName = $('#subjectNameCreateInput');

        this.updateInputStudentName = $('#studentNameUpdateInput');
        this.updateInputGroupName = $('#groupNameUpdateInput');
        this.updateInputRating = $('#ratingUpdateInput');
        this.updateInputSubjectName = $('#subjectNameUpdateInput');
        this.updateInputKey = $('#keyUpdateInput');

        this.studentRef.on('child_added', function(data) {
            let newStudent = data.val();
            newStudent.key = data.key;
            thisObj.allStudents.push(newStudent);
            thisObj.refresh();
        });

        this.studentRef.on('child_changed', function(data) {
            let newStudent = data.val();
            newStudent.key = data.key;
            let foundIndex = thisObj.allStudents.findIndex(function (item) {
                return item.key === data.key;
            });
            if(foundIndex !== -1)
            {
                thisObj.allStudents[foundIndex] = newStudent;
            }
            thisObj.refresh();
        });

        this.studentRef.on('child_removed', function(data) {
            thisObj.allStudents = thisObj.allStudents.filter(function(item){
                return item.key !== data.key;
            });
            thisObj.refresh();
        });


        this.filterBy();
        this.sortByField();
        this.renderWidget();
    }

    createStudent(studentName, groupName, rating, subjectName) {
        let newStudent = {
            studentName : studentName,
            groupName: groupName,
            rating : rating,
            subjectName: subjectName
        };
        this.db.ref('student').push(newStudent);
    }

    updateStudent(key,studentName, groupName, rating, subjectName)
    {
        let newStudent = {
            studentName : studentName,
            groupName: groupName,
            rating : rating,
            subjectName: subjectName
        };

        this.db.ref('student/'+key).set(newStudent);
    }


    deleteStudent(key)
    {
        this.db.ref('student/'+key).remove();
    }

    renderWidget()
    {
        let objectName = "dataTableExample";
        let container = $(this.containerID);
        container.html('');

        let searchDiv = $('<div class="form-group row" style="margin: 20px 10px 10px 10px">');
        searchDiv.append('<label for="searchInput" class="form-control-label">Search</label>');
        searchDiv.append(
                $('<input id="searchInput" class="" onchange="onClickFilter(\''+objectName+'\');">').val(this.filter)

        );
        container.append(searchDiv);
        container.append($('<div>').html('<b>Count: ' + this.displayStudents.length + "</b>"));
        let tableHtml = $('<table class="table table-striped" style="background-color: #dadada">');
        //headers
        let header = $('<tr>');
        header.append($('<th>').text('#'));
        for(let i =0;i<this.studentFields.length;i++)
        {
            let a = $('<a href="#">').click({param1:objectName},onClickSortByField).text(this.studentFields[i]);
            if(this.studentFields[i] === this.sortField)
            {
                a = $('<b>').append(a).append(this.isDescSort?' <i class="fas fa-long-arrow-alt-down"></i>':' <i class="fas fa-long-arrow-alt-up"></i>');
            }else{
                a = $('<span>').append(a).append(' <i class="fas fa-arrows-alt-v" style="color: rgba(133,133,133,0.31)"></i>');
            }
            header.append($('<th>').append(a))
        }
        header.append($('<th>').html('<i class="fas fa-edit"></i>'));
        header.append($('<th>').html('<i class="fas fa-trash-alt"></i>'));
        tableHtml.append(header);
        //table data
        let firstDisplayI = (this.currentPage) * this.rowsOnPage;
        let lastDisplayI = ((this.currentPage) * this.rowsOnPage + this.rowsOnPage < this.displayStudents.length)? (this.currentPage) * this.rowsOnPage + this.rowsOnPage: this.displayStudents.length;
        for(let i =  firstDisplayI;i<lastDisplayI;i++)
        {
            let rowHtml = $('<tr>');

            rowHtml.append($('<td>').text(i + 1));
            for(let j =0;j<this.studentFields.length;j++)
            {
                rowHtml.append(
                    $('<td>').text(this.displayStudents[i][this.studentFields[j]])
                );
            }
            rowHtml.append($('<td>').append($('<a href="#" class="fas fa-pen">').click({param1:i,param2:objectName},onClickUpdateStudent)));
            rowHtml.append($('<td>').html('<input type="checkbox" name="type" value="'+this.displayStudents[i].key+'" />'));
            rowHtml.append( $('<td id="key' + i + '" hidden>').text(this.displayStudents[i].key));
            tableHtml.append(rowHtml);
        }
        container.append(tableHtml);
        //pages buttons
        let pagination = $('<div class="col-md-6" style="margin: 10px; float: left;">');
        let allPagesCount = Math.ceil((this.displayStudents.length ) / this.rowsOnPage);
        this.displayPagesCount = (allPagesCount > this.maxDisplayPages)? this.maxDisplayPages : allPagesCount;
        let firstDisplayPage = 0;
        let lastDisplayPage = this.displayPagesCount;
        if(allPagesCount > this.maxDisplayPages)
        {
            if(this.currentPage - Math.trunc(this.maxDisplayPages/2) < 0)
            {
                firstDisplayPage = 0;
                lastDisplayPage = this.maxDisplayPages;
            }
            else if(this.currentPage + Math.trunc(this.maxDisplayPages/2) > allPagesCount)
            {
                firstDisplayPage = allPagesCount - 10;
                lastDisplayPage = allPagesCount;
            }else{
                firstDisplayPage = this.currentPage - Math.trunc(this.maxDisplayPages/2);
                lastDisplayPage = this.currentPage + Math.trunc(this.maxDisplayPages/2);
            }
        }

        for(let i = firstDisplayPage;i<lastDisplayPage;i++)
        {
            let enable = 'enable';
            if(i === this.currentPage)
                enable = 'disabled';
            let button = $('<button ' + enable +' class="btn btn-sm btn-info" style="margin: 2px 10px 10px 0; width: 40px; height: 40px; background-color: rgba(32,38,255,0.46); border-radius: 20px">').text(i+1);
            button.click({param1:objectName},onSwitchPageClick);
            pagination.append(button);
        }
        container.append(pagination);
        //control buttons
        let controlPanel = $('<div style="margin: 10px 20px 10px 20px; float: right">');
        controlPanel.append($('<button  type="button" class="btn btn-primary" data-toggle="modal" data-target="#addRowModal" style=" color: white">').text('Create'));
        controlPanel.append($('<button class="btn btn-danger" data-toggle="modal" data-target="#deleteRowsModal" style=" margin-left: 10px ;">').text('Delete Selected'));
        controlPanel.append($('<button class="btn btn-info" style=" margin-left: 10px ;">').text('Refresh').click(function (objName) {window[objName].refresh();}));
        controlPanel.append($('<button hidden id="updateButton" data-toggle="modal" data-target="#updateRowModal">').text('Update'));
        container.append(controlPanel);

    }
    refresh() {
        this.filterBy();
        this.sortByField();
        this.renderWidget();
    }

    sortByField()
    {
        if(this.sortField !== null)
        {
            if(typeof this.allStudents[0][this.sortField] === "number")
            {
                if(this.isDescSort)
                {
                    this.displayStudents = this.displayStudents.sort((a,b) =>{
                        return a[this.sortField] - b[this.sortField];
                    });
                }else{
                    this.displayStudents = this.displayStudents.sort((a,b) => {
                        return b[this.sortField] - a[this.sortField];
                    });
                }

            }else{
                if(this.isDescSort)
                {
                    this.displayStudents = this.displayStudents.sort((a,b) => {
                        return -a[this.sortField].localeCompare(b[this.sortField])
                    });
                }else{
                    this.displayStudents = this.displayStudents.sort( (a,b)=>{

                        return a[this.sortField].localeCompare(b[this.sortField])
                    });
                }

            }

        }
    }

    filterBy()
    {
        if(this.filter !== '')
        {
            this.displayStudents = this.allStudents.filter( (value)=>{
                return value.subjectName.indexOf(this.filter) !== -1
                    || value.studentName.indexOf(this.filter) !== -1
                    || value.groupName.indexOf(this.filter) !== -1
                    || (value.age+'').indexOf(this.filter) !== -1
            });
        }else
            this.displayStudents = this.allStudents.slice(0);
    }
}

function onSwitchPageClick(objName)
{
    let datatableonj = window[objName.data.param1];
    datatableonj.currentPage = parseInt(this.innerText) - 1;
    console.log(this);
    datatableonj.renderWidget();
}

function onClickFilter(objName)
{
    let datatableonj = window[objName];
    datatableonj.filter = $('#searchInput').val();
    console.log(datatableonj.filter);
    datatableonj.filterBy();
    datatableonj.renderWidget();
}
function onClickSortByField(objName)
{
    let datatableonj = window[objName.data.param1];
    let oldSortField = datatableonj.sortField;
    datatableonj.sortField = this.innerText;
    if(oldSortField === datatableonj.sortField) {
        datatableonj.isDescSort = !datatableonj.isDescSort;
    }else{
        datatableonj.isDescSort = false;
    }
    datatableonj.sortByField();
    datatableonj.renderWidget();
}

function onClickCreateStudent(objName)
{
    let datatableonj = window[objName];
    let studentName = datatableonj.createInputStudentName.val();
    let groupName = datatableonj.createInputGroupName.val();
    let rating = datatableonj.createInputRating.val();
    let subjectName = datatableonj.createInputSubjectName.val();
    if(studentName === '' || groupName === '' || rating === '' || subjectName === '')
        return;
    datatableonj.createStudent(studentName,groupName,parseInt(rating),subjectName);

    $('#closeAddRowModal').click();

    datatableonj.createInputStudentName.val('');
    datatableonj.createInputGroupName.val('');
    datatableonj.createInputRating.val('');
    datatableonj.createInputSubjectName.val('');

}

function onClickDeleteStudent(objName) {
    let datatableonj = window[objName];
    let selected = [];

    $("input:checkbox[name=type]:checked").each(function() {
        selected.push($(this).val());
    });
    selected.forEach(function (value) {
        datatableonj.deleteStudent(value);
    });
    $('#closeDeleteRowsModalModal').click();
}

function onClickUpdateStudent(event) {
    let index = event.data.param1;
    let datatableonj = window[event.data.param2];
    $('#updateButton').click();
    datatableonj.updateInputStudentName.val(datatableonj.displayStudents[index].studentName);
    datatableonj.updateInputGroupName.val(datatableonj.displayStudents[index].groupName);
    datatableonj.updateInputRating.val(datatableonj.displayStudents[index].rating);
    datatableonj.updateInputSubjectName.val(datatableonj.displayStudents[index].subjectName);
    datatableonj.updateInputKey.val(datatableonj.displayStudents[index].key);
}

function onClickUpdateSaveStudent(objName) {
    let datatableonj = window[objName];
    let studentName = datatableonj.updateInputStudentName.val();
    let groupName = datatableonj.updateInputGroupName.val();
    let rating = datatableonj.updateInputRating.val();
    let subjectName = datatableonj.updateInputSubjectName.val();
    let key = datatableonj.updateInputKey.val();

    if(studentName === '' || groupName === '' || rating === '' || subjectName === '')
        return;
    datatableonj.updateStudent(key,studentName,groupName,parseInt(rating),subjectName);

    $('#closeUpdateRowModal').click();

    datatableonj.updateInputStudentName.val('');
    datatableonj.updateInputGroupName.val('');
    datatableonj.updateInputRating.val('');
    datatableonj.updateInputSubjectName.val('');
}