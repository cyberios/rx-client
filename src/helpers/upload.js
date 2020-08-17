import axios from 'axios';

export default {
  upload_image(url, file, name = 'avatar', blog_id) {
    if (typeof url !== 'string') {
      throw new TypeError(`Expected a string, got ${typeof url}`);
    }

    // You can add checks to ensure the url is valid, if you wish

    const formData = new FormData();
    formData.append(name, file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return axios.post(url, formData, config);
  },
};
