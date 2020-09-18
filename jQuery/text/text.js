function InitPicUploader() {
    this.picUploader = new FileUploader({
        url: this.config.getUrl('content_atlas_upload'),
        withCredentials: true,
        method: 'post',
    });
    this.picUploader.onAfterAddingAll = (item) => {
        this.f_loading = true;
        item.forEach((file) => {
            file.random = this.getProgressRandom();
            file.uid = this.genUniqHash();
            file.isLoad = true;
            file.progress = 0;
            file.formData.push({
                access_token: this.userInfo.access_token,
            });
        });
        // 处理批量上传还是单
        if (this.currentImgIndex == 'add') {
            const filelist = item.map((vv) => {
                const obj = {
                    progress: vv.progress,
                    random: vv.random,
                    uid: vv.uid,
                    isLoad: vv.isLoad,
                };
                return obj;
            });
            this.imgDetailList = this.imgDetailList.concat(filelist);
        } else {
            this.imgDetailList[this.currentImgIndex] = item[0];
        }
        this.picUploader.uploadAll();
    };
    this.picUploader.onProgressItem = (item, progress) => {
        angular.forEach(this.imgDetailList, (vv) => {
            if (vv.uid == item.uid && vv.isLoad == true) {
                if (progress < (vv.random || 80)) {
                    vv.progress = progress;
                }
            }
        });
    };
    this.picUploader.onCompleteItem = (fileItem, response) => {
        this.f_loading = false;
        if (response && (response.error_code || response.error_message)) {
            this.myUtils.newHogeTip({
                msg: response.error_message,
            }, () => {});
        }
        const img = response.data;
        const index = this.imgDetailList.findIndex(obj => obj.uid == fileItem.uid);
        const fileobj = {
            photo_url: img.photo_url,
            photo_key: img.photo_key,
            material_id: img.material_id,
            photo_name: img.photo_name,
            id: img.id,
            order_id: img.order_id,
            brief: '',
        };
        // 处理批量上传还是单
        if (this.currentImgIndex == 'add') {
            this.imgDetailList[index] = fileobj;
        } else {
            this.imgDetailList[this.currentImgIndex] = fileobj;
        }
        this.getSuggestTags();
    };
}