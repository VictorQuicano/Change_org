$('#post-comment').hide();

$('#btn-toggle-comment').click(function(e){
    e.preventDefault();
    $('#post-comment').slideToggle();
})

$('#btn-like').click(function(e) {
    e.preventDefault();
    let image_id = $(this).data('id');
    $.post('/images/' + image_id + '/like')
        .done(data =>{
            $('.likes-count').text(data.likes);
        })
}); 

$('#btn-delete').click(function(e){
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Are you sure you want to delete this image? ');
    if(response){
        let imgId =  $this.data('id');
        $.ajax({
            url : '/images/' + imgId,
            type : 'DELETE'
        })
            .done((result)=>{
                $this.removeClass('btn-danger').addClass('btn-success')
                $this.find('i').removeClass('fa-times').addClass('fa-check')
                $this.append('D')
                $this.location.href = '/images'
            })
    }
})