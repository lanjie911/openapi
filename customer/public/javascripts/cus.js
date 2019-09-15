// 客户模块
// 更换图片
function changePic(evt) {
   var aEl = evt.parentNode;
   var windowURL = window.URL || window.webkitURL;
   var fileObj = evt.files[0];
   var dataURL = windowURL.createObjectURL(fileObj);
   aEl.style.backgroundImage = "url(" + dataURL + ")";
}

function submitPerson(ele) {
   var formdata = new FormData();
   formdata.append('p-id-0', mui('#p-id-0')[0].files[0]);
   formdata.append('p-id-1', mui('#p-id-1')[0].files[0]);
   formdata.append('p-id-2', mui('#p-id-2')[0].files[0]);

   mui.ajax({
      url: '/upload/custup',
      type: 'post',
      contentType: false,
      data: formdata,
      processData: false,
      success: function (resp) {
         if(resp.rs == "OK"){
            //上传成功
            mui.toast('上传成功，等待审核',{ duration:'short', type:'div' });
            ele.disabled = true;
            mui("#pvtext")[0].innerHTML = "审核中";
         }else{
            mui.toast('文件上传失败',{ duration:'short', type:'div' });
         }
      },
      error: function (err) {
         console.log(err)
      }
   });
}