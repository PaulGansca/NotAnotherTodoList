new ClipboardJS('.btn');
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})

$('[data-toggle="tooltip"]').on('shown.bs.tooltip', () => {
    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip('hide');
    }, 500)
})