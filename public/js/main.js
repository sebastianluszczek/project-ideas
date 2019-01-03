document.addEventListener('DOMContentLoaded', function () {
    var sidenav_inst = M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
    var dropdown_inst = M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
        coverTrigger: false,
        hover: true
    })
});