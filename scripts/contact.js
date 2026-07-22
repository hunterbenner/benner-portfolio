/*
    Author: Hunter Benner
    File Name: contact.js
    Date: 07/21/2026

    Part 4: contact form validation.
    The form keeps the browser's built-in constraint validation
    attributes (required, minlength, type="email", pattern). This
    script takes over the *reporting*: errors appear as inline text
    under each field, focus moves to the first invalid field, and the
    status message is honest about this being a static class project.
    If JavaScript is unavailable, the browser's native validation
    still runs because novalidate is only added from here.
*/
(function () {
    'use strict';

    var form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    var status = document.getElementById('form-status');
    var fields = form.querySelectorAll('input, select, textarea');

    // JS is running, so switch off native error bubbles and report inline.
    form.setAttribute('novalidate', '');

    // Remember each field's original aria-describedby (the visible hints)
    // so error messages can be appended to it and removed cleanly.
    fields.forEach(function (field) {
        field.dataset.hintIds = field.getAttribute('aria-describedby') || '';
    });

    function labelTextFor(field) {
        var label = form.querySelector('label[for="' + field.id + '"]');
        return label ? label.textContent.replace(/\s*\(optional\)\s*/i, '').trim().toLowerCase() : 'this field';
    }

    // Build a specific, useful message from the field's validity state.
    function messageFor(field) {
        var v = field.validity;
        if (v.valueMissing) {
            if (field.tagName === 'SELECT') {
                return 'Please choose a reason for contacting.';
            }
            return 'Please enter your ' + labelTextFor(field) + '.';
        }
        if (v.typeMismatch && field.type === 'email') {
            return 'Please enter a valid email address, like name@example.com.';
        }
        if (v.tooShort) {
            return 'Please use at least ' + field.minLength + ' characters (currently ' +
                field.value.length + ').';
        }
        if (v.patternMismatch) {
            return 'Please use only digits, spaces, and + ( ) - . characters.';
        }
        return field.validationMessage;
    }

    function clearError(field) {
        var errorEl = document.getElementById(field.id + '-error');
        if (errorEl) {
            errorEl.remove();
        }
        field.removeAttribute('aria-invalid');
        if (field.dataset.hintIds) {
            field.setAttribute('aria-describedby', field.dataset.hintIds);
        } else {
            field.removeAttribute('aria-describedby');
        }
    }

    function showError(field) {
        var errorId = field.id + '-error';
        var errorEl = document.getElementById(errorId);
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'field-error';
            errorEl.id = errorId;
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = messageFor(field);
        field.setAttribute('aria-invalid', 'true');
        var describedBy = field.dataset.hintIds ?
            field.dataset.hintIds + ' ' + errorId : errorId;
        field.setAttribute('aria-describedby', describedBy);
    }

    // Clear a field's error as soon as the user starts fixing it.
    fields.forEach(function (field) {
        field.addEventListener('input', function () {
            if (field.checkValidity()) {
                clearError(field);
            }
        });
    });

    form.addEventListener('submit', function (event) {
        // Always prevent submission: this is a static site with no backend.
        event.preventDefault();

        var invalid = [];
        fields.forEach(function (field) {
            if (field.checkValidity()) {
                clearError(field);
            } else {
                showError(field);
                invalid.push(field);
            }
        });

        if (invalid.length > 0) {
            status.className = 'form-status is-error';
            status.textContent = 'Please fix the ' + invalid.length +
                (invalid.length === 1 ? ' highlighted field.' : ' highlighted fields.');
            invalid[0].focus();
            return;
        }

        // Honest result: nothing is sent because no backend is configured.
        status.className = 'form-status is-success';
        status.textContent = 'Form validated successfully. This classroom demo does not ' +
            'send messages yet; please use the email link.';
    });
})();
