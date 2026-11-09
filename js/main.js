// Relative URLs so the app works wherever it is served from (built-in server, Apache, XAMPP)
var countriesURL = "api/countries";
var usersURL = "api/users";
var countryMap = {};
var currentModalCountryId = null;

// Generic GET all
var findAll = function(URL, method) {
    $.ajax({
        type: 'GET',
        url: URL,
        dataType: "json",
        success: method
    });
};

// GET by id
var findById = function(url, renderDetails, id) {
    $.ajax({
        type: 'GET',
        url: url + '/' + id,
        dataType: "json",
        success: function(data){
            renderDetails(data);
        }
    });
};

// Render single country modal with full details
var renderCountryDetails = function(country) {
    // Add to countryMap in case it wasn't there
    countryMap[country.id] = country;
    
    var htmlStr =
        '<h2>' + country.name + '</h2>' +
        '<p><strong>First Year:</strong> ' + country.first_year + '</p>' +
        '<p><strong>Wins:</strong> ' + country.wins + '</p>' +
        '<p><strong>Contests Entered:</strong> ' + country.contests + '</p>' +
        '<p><strong>Best Placement:</strong> ' + country.best_place + '</p>' +
        '<p><strong>Max Points:</strong> ' + country.max_points + '</p>' +
        '<p><strong>Automatic Qualification:</strong> ' + (country.automatic_qualification ? 'Yes' : 'No') + '</p><hr>';

    $("#contents").html(htmlStr);
    // Store the current country ID globally
    currentModalCountryId = country.id;
    $('#myModal').modal('show');
};

// Render country list table
var renderCountryList = function (data) {
    list = data.country;

    list.forEach(c => countryMap[c.id] = c);

    $.each(list, function(index, country) {
        let qual = country.automatic_qualification ? 'Yes' : 'No';

        $('#table_body').append(
            `<tr>
                <td>${country.name}</td>
                <td>${country.wins}</td>
                <td>${qual}</td>
                <td>${country.max_points}</td>
                <td>${country.best_place}</td>
                <td id="${country.id}"><a href="#">More Info</a></td>
            </tr>`
        );
    });

    $('#table_id').DataTable();
};

// Flag images can be .svg or .png: try .svg first, then .png, then the default flag
var flagFallback = function(img) {
    if (img.dataset.png && !img.dataset.triedPng) {
        img.dataset.triedPng = '1';
        img.src = img.dataset.png;
    } else {
        img.onerror = null;
        img.src = 'images/default.svg';
    }
};

// Render country cards for home page
var renderCountryCards = function (data) {
    $('#countryCardContainer').empty(); // Clear UI before reloading
    
    if (!data || !data.country) {
        return;
    }
    
    list = data.country;
    
    // Store countries for duplicate checking
    renderCountryCards.lastCountries = list;

    $.each(list, function(index, country) {
        const card = $(`
            <div class="card country-card" style="min-width:150px;" data-id="${country.id}">
                <img src="images/${encodeURIComponent(country.name)}.svg"
                     class="card-img-top"
                     data-png="images/${encodeURIComponent(country.name)}.png"
                     onerror="flagFallback(this)">
                <div class="card-body text-center">
                    <h5 class="card-title">${country.name}</h5>
                </div>
            </div>
        `);

        $('#countryCardContainer').append(card);
    });
};

// Add country
var addCountry = function(countryData) {
    $.ajax({
        type: "POST",
        url: countriesURL,
        contentType: "application/json",
        data: JSON.stringify(countryData),
        success: function() {
            $("#countryFormMessage").html("<div class='alert alert-success'>Country added successfully!</div>");
            $("#countryForm")[0].reset();
            $('#countryId').val('');
            // Refresh both table and cards
            $('#table_body').empty();
            findAll(countriesURL, function(data) {
                renderCountryList(data);
                renderCountryCards(data);
            });
        },
        error: function() {
            $("#countryFormMessage").html("<div class='alert alert-danger'>Error adding country.</div>");
        }
    });
};

// Update country
var updateCountry = function(id, countryData) {
    $.ajax({
        type: "PUT",
        url: countriesURL + '/' + id,
        contentType: "application/json",
        data: JSON.stringify(countryData),
        success: function() {
            $("#countryFormMessage").html("<div class='alert alert-success'>Country updated successfully!</div>");
            $("#countryForm")[0].reset();
            $('#countryId').val('');
            
            // Reset button state
            $('#saveCountryBtn').show();
            $('#updateCountryBtn').hide();
            
            // Make name field editable again
            $('#countryName').prop('readonly', false);
            
            // Refresh both table and cards
            $('#table_body').empty();
            findAll(countriesURL, function(data) {
                renderCountryList(data);
                renderCountryCards(data);
            });
        },
        error: function() { //error message
            $("#countryFormMessage").html("<div class='alert alert-danger'>Error updating country.</div>");
        }
    });
};

// Delete country
var deleteCountry = function(id) {
    if (!confirm('Are you sure you want to delete this country?')) return;
    
    $.ajax({
        type: "DELETE",
        url: countriesURL + '/' + id,
        success: function() {
            $("#countryFormMessage").html("<div class='alert alert-success'>Country deleted successfully!</div>");
            $("#countryForm")[0].reset();
            $('#countryId').val('');
            
            // Reset button state
            $('#saveCountryBtn').show();
            $('#updateCountryBtn').hide();
            
            // Make name field editable again
            $('#countryName').prop('readonly', false);
            
            // Refresh both table and cards
            $('#table_body').empty();
            findAll(countriesURL, function(data) {
                renderCountryList(data);
                renderCountryCards(data);
            });
        },
        error: function() {
            $("#countryFormMessage").html("<div class='alert alert-danger'>Error deleting country.</div>");
        }
    });
};

// Load country data for editing when Edit button is clicked
var loadCountryForEdit = function(id) {
    var country = countryMap[id];
    if (!country) {
        $("#countryFormMessage").html("<div class='alert alert-danger'>Error loading country data.</div>");
        return;
    }
    
    $('#countryId').val(country.id);
    $('#countryName').val(country.name);
    $('#wins').val(country.wins);
    $('#contests').val(country.contests);
    $('#bestPlace').val(country.best_place);
    $('#maxPoints').val(country.max_points);
    $('#automaticQualification').val(country.automatic_qualification);
    $('#firstYear').val(country.first_year);
    
    // Switch buttons: hide Add, show Update
    $('#saveCountryBtn').hide();
    $('#updateCountryBtn').show();
    
    // Make name field read-only
    $('#countryName').prop('readonly', true);
    
    $("#countryFormMessage").html('');
    $('#myModal').modal('hide');
    
    // Scroll to form
    $('html, body').animate({
        scrollTop: $("#countryForm").offset().top - 100
    }, 800);
};

// Handle country form submit
var handleCountryFormSubmit = function(e) {
    e.preventDefault();
    
    let countryName = $('#countryName').val().trim();
    let countryId = $('#countryId').val();
    
    // Check if country name already exists (only when adding new country)
    if (!countryId) {
        let countryExists = false;
        $.each(renderCountryCards.lastCountries || [], function(index, country) {
            if (country.name === countryName) {
                countryExists = true;
                return false; // break
            }
        });
        
        if (countryExists) {
            $("#countryFormMessage").html("<div class='alert alert-danger'>Country name already exists. Please choose a different name.</div>");
            return;
        }
    }
    
    let countryData = {
        name: countryName,
        wins: parseInt($('#wins').val()) || 0,
        contests: parseInt($('#contests').val()) || 0,
        best_place: $('#bestPlace').val().trim(),
        max_points: parseInt($('#maxPoints').val()) || 0,
        automatic_qualification: parseInt($('#automaticQualification').val()),
        first_year: parseInt($('#firstYear').val())
    };

    // Check if we're in edit mode
    if (countryId) {
        // Validate that something changed
        var country = countryMap[countryId];
        if (!country) {
            $("#countryFormMessage").html("<div class='alert alert-danger'>Error: Could not load original country data.</div>");
            return;
        }
        
        // Compare current values with original (convert types for comparison)
        if (parseInt(country.wins) === countryData.wins &&
            parseInt(country.contests) === countryData.contests &&
            country.best_place === countryData.best_place &&
            parseInt(country.max_points) === countryData.max_points &&
            parseInt(country.automatic_qualification) === countryData.automatic_qualification &&
            parseInt(country.first_year) === countryData.first_year) {
            $("#countryFormMessage").html("<div class='alert alert-warning'>Please change something to update the country.</div>");
            return;
        }
        
        updateCountry(countryId, countryData);
    } else {
        addCountry(countryData);
    }
};

// Render user table with action buttons
var renderUserTable = function(data) {
    $('#userTableBody').empty();
    
    let users = data && data.users ? data.users : [];
    
    // Store users for duplicate checking
    renderUserTable.lastUsers = users;
    
    if (!users || users.length === 0) {
        return;
    }

    $.each(users, function(index, user) {
        let imageHtml = user.image 
            ? `<img src="images/${user.image}" alt="${user.name}" style="width: 40px; height: 30px; object-fit: contain;" onerror="this.onerror=null; this.src='images/default.svg';">`
            : 'N/A';
        
        $('#userTableBody').append(
            `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${imageHtml}</td>
                <td>
                    <button class="btn btn-sm btn-info edit-user" data-id="${user.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-user-table" data-id="${user.id}">Delete</button>
                </td>
            </tr>`
        );
    });
};

// Add user
var addUser = function(userData) {
    $.ajax({
        type: "POST",
        url: usersURL,
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function(response) {
            $("#userFormMessage").html("<div class='alert alert-success'>User added successfully!</div>");
            $("#userForm")[0].reset();
            $('#userId').val('');
            // Force refresh the user table
            setTimeout(function() {
                findAll(usersURL, renderUserTable);
            }, 100);
        },
        error: function(xhr) {
            let errorMessage = xhr.status === 409 ? "Username already exists." : "Error adding user.";
            $("#userFormMessage").html("<div class='alert alert-danger'>" + errorMessage + "</div>");
        }
    });
};

// Update user
var updateUser = function(id, userData) {
    $.ajax({
        type: "PUT",
        url: usersURL + '/' + id,
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function() {
            $("#userFormMessage").html("<div class='alert alert-success'>User updated successfully!</div>");
            $("#userForm")[0].reset();
            $('#userId').val('');
            // After update, keep Add visible and hide Update again
            $('#saveUserBtn').show();
            $('#updateUserBtn').hide();
            findAll(usersURL, renderUserTable);
        },
        error: function() {
            $("#userFormMessage").html("<div class='alert alert-danger'>Error updating user.</div>");
        }
    });
};

// Delete user
var deleteUser = function(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    $.ajax({
        type: "DELETE",
        url: usersURL + '/' + id,
        success: function() {
            $("#userFormMessage").html("<div class='alert alert-success'>User deleted successfully!</div>");
            $("#userForm")[0].reset();
            $('#userId').val('');
            $('#saveUserBtn').show();
            $('#updateUserBtn').hide();
            findAll(usersURL, renderUserTable);
        },
        error: function() {
            $("#userFormMessage").html("<div class='alert alert-danger'>Error deleting user.</div>");
        }
    });
};

// Handle user form submit
var handleUserFormSubmit = function(e) {
    e.preventDefault();
    
    let imageValue = $('#image').val().trim();
    // Set default.svg if image is empty or isn't an .svg/.png file
    if (!imageValue || !(imageValue.endsWith('.svg') || imageValue.endsWith('.png'))) {
        imageValue = 'default.svg';
    }
    
    let usernameValue = $('#username').val().trim();
    let userId = $('#userId').val();
    
    // Check if username already exists (only when adding new user)
    if (!userId) {
        // Check all existing users
        let userExists = false;
        $.each(renderUserTable.lastUsers || [], function(index, user) {
            if (user.username === usernameValue) {
                userExists = true;
                return false; // break
            }
        });
        
        if (userExists) {
            $("#userFormMessage").html("<div class='alert alert-danger'>Username already exists. Please choose a different username.</div>");
            return;
        }
    }
    
    let userData = {
        name: $('#userName').val().trim(),
        username: usernameValue,
        password: $('#password').val(),
        image: imageValue
    };

    // Check if we're in edit mode
    if (userId) {
        updateUser(userId, userData);
    } else {
        addUser(userData);
    }
};

// Load user data into form for editing
var loadUserForEdit = function(id) {
    $.ajax({
        type: 'GET',
        url: usersURL + '/' + id,
        dataType: "json",
        success: function(user) {
            $('#userId').val(user.id);
            $('#userName').val(user.name);
            $('#username').val(user.username);
            $('#password').val(user.password);
            $('#image').val(user.image || '');
            
            // Hide Add button, show Update button
            $('#saveUserBtn').hide();
            $('#updateUserBtn').show();
            
            // Scroll to form
            $('html, body').animate({
                scrollTop: $("#userForm").offset().top - 100
            }, 500);
        }
    });
};

// Event handler functions
var handleCountryCardClick = function() {
    findById(countriesURL, renderCountryDetails, $(this).data('id'));
};

var handleCountryTableClick = function() {
    if (this.id) {
        findById(countriesURL, renderCountryDetails, this.id);
    }
};

var handleCountryDeleteClick = function() {
    let id = $('#countryId').val();
    if (!id) {
        $("#countryFormMessage").html("<div class='alert alert-danger'>Please fill the form first.</div>");
        return;
    }
    deleteCountry(id);
};

var handleCountryResetClick = function() {
    $("#countryForm")[0].reset();
    $('#countryId').val('');
    
    // Switch buttons: show Add, hide Update
    $('#saveCountryBtn').show();
    $('#updateCountryBtn').hide();
    
    // Make name field editable again
    $('#countryName').prop('readonly', false);
    
    $('#saveCountryBtn').text('Add Country');
    $("#countryFormMessage").html('');
};

var handleCountryModalEditClick = function() {
    let id = currentModalCountryId;
    if (!id) {
        alert('Error: Country ID not found.');
        return;
    }
    loadCountryForEdit(id);
};

var handleCountryModalDeleteClick = function() {
    let id = currentModalCountryId;
    if (!id) {
        alert('Error: Country ID not found.');
        return;
    }
    if (!confirm('Are you sure you want to delete this country?')) return;
    
    $.ajax({
        type: "DELETE",
        url: countriesURL + '/' + id,
        success: function() {
            $("#countryFormMessage").html("<div class='alert alert-success'>Country deleted successfully!</div>");
            $("#countryForm")[0].reset();
            $('#countryId').val('');
            
            // Reset button state
            $('#saveCountryBtn').show();
            $('#updateCountryBtn').hide();
            
            // Make name field editable again
            $('#countryName').prop('readonly', false);
            
            $('#myModal').modal('hide');
            // Refresh both table and cards
            $('#table_body').empty();
            findAll(countriesURL, function(data) {
                renderCountryList(data);
                renderCountryCards(data);
            });
        },
        error: function() {
            $("#countryFormMessage").html("<div class='alert alert-danger'>Error deleting country.</div>");
        }
    });
};

var handleUserDeleteClick = function() {
    // Deletion is only available via table row action.
    $("#userFormMessage").html("<div class='alert alert-info'>Use the table delete button to remove a user.</div>");
};

var handleUserEditClick = function() {
    let id = $(this).data('id');
    loadUserForEdit(id);
};

var handleUserDeleteFromTableClick = function() {
    let id = $(this).data('id');
    deleteUser(id);
};

var handleUserResetClick = function() {
    $("#userForm")[0].reset();
    $('#userId').val('');
    $('#saveUserBtn').show();
    $('#updateUserBtn').hide();
    $("#userFormMessage").html('');
};

// Initialize on document ready
$(document).ready(function(){
    findAll(countriesURL, function(data) {
        renderCountryList(data);
        renderCountryCards(data);
    });

    findAll(usersURL, renderUserTable);

    // Country events
    $(document).on("click", '#table_body td', handleCountryTableClick);
    $(document).on("click", '.country-card', handleCountryCardClick);
    $(document).on("submit", "#countryForm", handleCountryFormSubmit);
    $(document).on("click", "#resetCountryForm", handleCountryResetClick);
    $(document).on("click", "#editCountryModalBtn", handleCountryModalEditClick);
    $(document).on("click", "#deleteCountryModalBtn", handleCountryModalDeleteClick);

    // User events
    $(document).on("submit", "#userForm", handleUserFormSubmit);
    // Removed form delete button handler; deletion via table only
    $(document).on("click", ".edit-user", handleUserEditClick);
    $(document).on("click", ".delete-user-table", handleUserDeleteFromTableClick);
    $(document).on("click", "#resetUserForm", handleUserResetClick);
});
