// 客户模块
// 更换图片
function changePic(evt) {
   var aEl = evt.parentNode;
   var windowURL = window.URL || window.webkitURL;
   var fileObj = evt.files[0];
   var dataURL = windowURL.createObjectURL(fileObj);
   aEl.style.backgroundImage = "url(" + dataURL + ")";
}

function submitPerson() {
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
      success: function (info) {
         console.log(info);
      },
      error: function (err) {
         console.log(err)
      }
   });
}