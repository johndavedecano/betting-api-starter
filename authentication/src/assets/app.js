$(document).ready(function() {
  var CLOSE_TIMEOUT = 2000

  // REGISTRATION
  $('#signup-form').on('submit', function(event) {
    event.preventDefault()

    var errorMessage = ''

    var name = $('#name')
    var username = $('#username')
    var email = $('#email')
    var password = $('#password')
    var passwordConfirmation = $('#password_confirmation')

    if (password.val() !== passwordConfirmation.val()) {
      errorMessage = 'Password must match'
    }

    if (password.val().length < 6) {
      errorMessage = 'Password must be atleast 8 characters'
    }

    if (password.val().length > 12) {
      errorMessage = 'Password must not be greater than 12 characters'
    }

    if (errorMessage !== '') {
      $('#validation-alert')
        .removeClass('hide')
        .addClass('show')
        .addClass('alert-danger')
        .show()
      $('#validation-message').text(errorMessage)
      return
    }

    $('.submit-button')
      .text('Please Wait...')
      .attr('disabled', true)

    var promise = $.ajax({
      type: 'POST',
      url: '/api/signup',
      data: JSON.stringify({
        name: name.val(),
        username: username.val(),
        email: email.val(),
        password: password.val(),
        password_confirmation: passwordConfirmation.val()
      }),
      contentType: 'application/json'
    })

    promise.always(function() {
      var type
      $('.submit-button')
        .text('Save Changes')
        .attr('disabled', false)
      if (promise.status === 200) {
        type = 'alert-success'
        $('#validation-alert')
          .removeClass('alert-danger')
          .addClass('alert-success')
        $('#validation-message').text(
          'Registration Success. We have sent you a verification email.'
        )
        setTimeout(function() {
          window.close()
        }, CLOSE_TIMEOUT)
      } else if (
        promise.status === 422 &&
        promise.responseJSON &&
        Array.isArray(promise.responseJSON.errors)
      ) {
        type = 'alert-danger'
        $('#validation-message').text(promise.responseJSON.errors[0])
      } else if (promise.status === 400) {
        type = 'alert-danger'
        $('#validation-message').text(promise.responseJSON.message)
      } else {
        type = 'alert-danger'
        $('#validation-message').text(
          'Unable to reset token for. Unknown error'
        )
      }

      $('#validation-alert')
        .removeClass('hide')
        .addClass('show')
        .addClass(type)
        .show()
    })
  })

  // RESET PASSWORD
  $('#change-password-form').on('submit', function(event) {
    event.preventDefault()

    var errorMessage = ''
    var password = $('#password')
    var passwordConfirmation = $('#password_confirmation')
    var token = $('#token')

    if (password.val() !== passwordConfirmation.val()) {
      errorMessage = 'Password must match'
    }

    if (password.val().length < 6) {
      errorMessage = 'Password must be atleast 8 characters'
    }

    if (password.val().length > 12) {
      errorMessage = 'Password must not be greater than 12 characters'
    }

    if (errorMessage !== '') {
      $('#validation-alert')
        .removeClass('hide')
        .addClass('show')
        .addClass('alert-danger')
        .show()
      $('#validation-message').text(errorMessage)
      return
    }

    $('.submit-button')
      .text('Please Wait...')
      .attr('disabled', true)

    var promise = $.ajax({
      type: 'PUT',
      url: '/api/reset',
      data: JSON.stringify({
        password: password.val(),
        password_confirmation: passwordConfirmation.val(),
        token: token.val()
      }),
      contentType: 'application/json'
    })

    promise.always(function() {
      var type
      $('.submit-button')
        .text('Save Changes')
        .attr('disabled', false)
      if (promise.status === 200) {
        type = 'alert-success'
        $('#validation-alert')
          .removeClass('alert-danger')
          .addClass('alert-success')
        $('#validation-message').text(
          'Password was successfully updated. Please wait...'
        )
        setTimeout(function() {
          window.close()
        }, CLOSE_TIMEOUT)
      } else if (promise.status === 404) {
        type = 'alert-danger'
        $('#validation-message').text('Reset token has already expired')
      } else if (
        promise.status === 422 &&
        promise.responseJSON &&
        Array.isArray(promise.responseJSON.errors)
      ) {
        type = 'alert-danger'
        $('#validation-message').text(promise.responseJSON.errors[0])
      } else {
        type = 'alert-danger'
        $('#validation-message').text(
          'Unable to reset token for. Unknown error'
        )
      }

      $('#validation-alert')
        .removeClass('hide')
        .addClass('show')
        .addClass(type)
        .show()
    })
  })
})
