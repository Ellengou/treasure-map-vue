<template>
  <div class="wrapper-content" style="background: transparent;">
    <div class="wrapper-box" style="background: transparent;">
      <div class="breadcrumb">
        <span class="pull-right el-breadcrumb back" @click="$router.go(-1)">返回上一级</span>
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>商户管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'antique' }">古玩城管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display" style="margin-top: 20px;padding: 0px;">
        <div class="display-main">
          <el-form :model="formProduct" :rules="rules" label-position="top" ref="formProduct">
            <el-row :gutter="20">
              <el-col :span="10">
                <div class="grid-content">
                  <div class="grid-top">基本资料</div>
                  <div class="grid-box" style="min-height: 950px;">
                    <el-form-item label="古玩城名称" prop="name" required>
                      <el-input v-model="formProduct.name" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="经营范围" prop="scope">
                      <el-input v-model="formProduct.scope" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="营业时间(必填)" style="width:500px;" required>
                      <el-col :span="8">
                        <el-form-item prop="date">
                          <el-select v-model="formProduct.date" placeholder="请选择" style="width: 160px;">
                            <el-option label="周一至周五" value="15"></el-option>
                            <el-option label="周一至周六" value="16"></el-option>
                            <el-option label="周一至周日" value="17"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="startTime" style="margin-left: 3px;">
                          <el-time-select
                            style="width: 160px;"
                            placeholder="起始时间"
                            v-model="formProduct.startTime"
                            :picker-options="{start: '06:00',step: '00:15',end: '23:30'}">
                          </el-time-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="endTime" style="text-align: right">
                          <el-time-select
                            style="width: 160px;"
                            placeholder="结束时间"
                            v-model="formProduct.endTime"
                            :picker-options="{start: '06:00',step: '00:15',end: '23:30',minTime: formProduct.startTime}">
                          </el-time-select>
                        </el-form-item>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="其它营业时间(选填)" style="width:500px;">
                      <el-col :span="8">
                        <el-form-item prop="date1">
                          <el-select v-model="formProduct.date1" placeholder="请选择" style="width: 160px;">
                            <el-option label="周六" value="66"></el-option>
                            <el-option label="周日" value="77"></el-option>
                            <el-option label="周六至周日" value="67"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="startTime1" style="margin-left: 3px;">
                          <el-time-select
                            style="width: 160px;"
                            placeholder="起始时间"
                            v-model="formProduct.startTime1"
                            :picker-options="{start: '06:00',step: '00:15',end: '23:30'}">
                          </el-time-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="endTime1" style="text-align: right">
                          <el-time-select
                            style="width: 160px;"
                            placeholder="结束时间"
                            v-model="formProduct.endTime1"
                            :picker-options="{start: '06:00',step: '00:15',end: '23:30',minTime: formProduct.startTime1}">
                          </el-time-select>
                        </el-form-item>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contact" required>
                      <el-input v-model="formProduct.contact" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="distribution">
                      <el-input
                        style="width: 500px;"
                        type="textarea"
                        placeholder=""
                        :maxlength="500"
                        :autosize="{ minRows: 3}"
                        v-model="formProduct.distribution">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="门头照片" prop="fileList" required>
                      <el-upload
                        action="basePath+'/image/upload'"
                        type="drag"
                        :thumbnail-mode="true"
                        :before-upload="uploadBefore"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :default-file-list="formProduct.fileList">
                        <i class="el-icon-upload"></i>
                        <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传图片文件，且不超过1M</div>
                      </el-upload>
                    </el-form-item>
                  </div>
                </div>
              </el-col>
              <el-col :span="14">
                <div class="grid-content">
                  <div class="grid-top">地理定位</div>
                  <div class="grid-box" style="min-height: 950px;">
                    <el-form-item label="详细地址" required>
                      <el-row :gutter="10">
                        <el-col :span="5">
                          <el-form-item prop="provinceCode">
                            <el-select v-model="formProduct.provinceCode" placeholder="省" style="width: 100%;"
                                       @change="provinceChange">
                              <el-option
                                v-for="item in provinceData"
                                :label="item.name"
                                :value="item.code">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item prop="cityCode">
                            <el-select v-model="formProduct.cityCode" placeholder="市" style="width: 100%;"
                                       :disabled="isCity" @change="cityChange">
                              <el-option
                                v-for="item in cityData"
                                :label="item.name"
                                :value="item.code">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="14">
                          <el-form-item prop="address">
                            <el-input v-model="formProduct.address" @change="addressChange"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <div id="allmap" style="height: 500px;"></div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-button style="background-color: #67738d;color: #fff;width: 100%;margin-top: 20px;"
                       @click="handleSubmit">
              提交
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
  @color: #333642;
  .first {
    border-top: 1px solid #e6e6e6;
  }

  .last {
    margin-bottom: 30px;
  }

  .el-checkbox {
    margin-right: 15px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
    margin-right: 15px;
  }

  .grid-content {
    border-top: 4px solid #e6e6e6;
    background-color: #fff;
    .grid-top {
      color: @color;
      padding: 0px 20px;
      height: 45px;
      line-height: 44px;
      border-bottom: 1px solid #e6e6e6;
    }
    .grid-box {
      padding: 20px;
    }
  }

  .grid-photo {
    .photo {
      display: inline-block;
      margin-right: 25px;
      width: 200px;
      height: 200px;
      &:nth-child(4) {
        margin-right: 0px;
      }
      [class^=el-icon] {
        color: #99a9bf;
        margin-right: 7px;
        height: 100%;
        line-height: inherit;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .el-upload__tip {
    margin-top: -10px;
    text-align: left !important;
  }
</style>

<script>
  export default {
    mounted(){
      this.getMap();
      //获取省
      this.axios.get('/api/city').then((response) => {
        if (response.data.code == 0) {
          this.provinceData = response.data.result.model;
        }
      }).catch((error) => {
        console.log(error)
      })
      //获取古玩城
      let id = this.$route.query.id;
      if (id) {
        this.axios.get('/api/curio/detail/' + id).then((response) => {
          if (response.data.code == 0) {
            this.id = response.data.result.model.id;
            this.formProduct.name = response.data.result.model.name;
            this.formProduct.scope = response.data.result.model.scope;
            let hours = JSON.parse(response.data.result.model.shopHours);
            this.formProduct.date = String(hours[0].startWeekDay * 10 + hours[0].endWeekDay);
            this.formProduct.startTime = hours[0].periods[0].startTime;
            this.formProduct.endTime = hours[0].periods[0].endTime;
            if (hours.length > 1 && hours[1].startWeekDay && hours[1].endWeekDay && hours[1].periods[0].startTime && hours[1].periods[0].endTime) {
              this.formProduct.date1 = String(hours[1].startWeekDay * 10 + hours[1].endWeekDay);
              this.formProduct.startTime1 = hours[1].periods[0].startTime;
              this.formProduct.endTime1 = hours[1].periods[0].endTime;
            }
            this.formProduct.contact = response.data.result.model.contact;
            this.formProduct.distribution = response.data.result.model.distribution;
            this.formProduct.fileList = [{name: '默认', url: response.data.result.model.banner}];
            this.formProduct.provinceCode = response.data.result.model.provinceCode ? parseInt(response.data.result.model.provinceCode) : '';
            this.province = response.data.result.model.province;
            if (response.data.result.model.code) {
              this.formProduct.cityCode = response.data.result.model.code ? parseInt(response.data.result.model.code) : '';
              this.city = response.data.result.model.city;
            }
            this.formProduct.address = response.data.result.model.address;
          } else {
            this.$message.error({
              message: response.data.desc,
              showClose: true
            });
          }
        })
      }
    },
    data(){
      return {
        //省数组
        provinceData: [],
        province: '',
        //市数组
        cityData: [],
        city: '',
        //是否直辖市
        isCity: true,
        //经纬度
        coordinate: '',
        //验证数组
        formProduct: {
          name: '',
          scope: '',
          date: '',
          startTime: '',
          endTime: '',
          date1: '',
          startTime1: '',
          endTime1: '',
          contact: '',
          distribution: '',
          fileList: [],
          provinceCode: '',
          cityCode: '',
          address: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入古玩城名称', trigger: 'blur'}
          ],
          date: [
            {required: true, message: '请选择营业时间', trigger: 'change'}
          ],
          startTime: [
            {required: true, message: '请选择起始时间', trigger: 'change'}
          ],
          endTime: [
            {required: true, message: '请选择结束时间', trigger: 'change'}
          ],
          contact: [
            {required: true, message: '请输入联系方式', trigger: 'blur'}
          ],
          fileList: [
            {required: true, type: 'array', message: '请至少上传一张图片', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      provinceChange(val){
        if (val) {
          let arr = [11, 12, 21, 31, 50, 71, 82].filter((item) => {
            return item == val
          });
          if (!this.$route.query.id) {
            this.province = this.provinceData.filter((item) => {
              return item.code == val
            })[0].name;
            this.formProduct.cityCode = '';
            this.city = '';
          }
          this.addressChange()
          if (arr.length) {
            this.isCity = true;
          } else {
            this.isCity = false;
            this.axios.get('/api/city/' + val + '/level/2').then((response) => {
              if (response.data.code == 0) {
                this.cityData = response.data.result.model;
              }
            }).catch((error) => {
              console.log(error)
            })
          }
        }
      },
      cityChange(val){
        if (val) {
          if (!this.$route.query.id) {
            this.city = this.cityData.filter((item) => {
              return item.code == val
            })[0].name;
          }
          this.addressChange()
        }
      },
      addressChange(val){
        this.getMap(this.province, this.city, this.formProduct.address)
      },
      getMap(province, city, address){
        // 百度地图API功能
        var map = new BMap.Map("allmap");
        if (this.province) {
          if (this.city) {
            map.centerAndZoom(this.city, 12);
          } else {
            map.centerAndZoom(this.province, 12);
          }
        } else {
          map.centerAndZoom('浙江省', 12);
        }
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(address, (point) => {
          if (point) {
            this.coordinate = point;
            map.centerAndZoom(point, 16);
            map.addOverlay(new BMap.Marker(point));
          } else {
            this.coordinate = '';
          }
        }, this.isCity ? province : city);
      },
      handleSubmit() {
        this.$refs.formProduct.validate((valid) => {
          if (valid) {
            let curio = {
              param: {
                id: this.id,
                name: this.formProduct.name,
                scope: this.formProduct.scope,
                shopHours: JSON.stringify([{
                  "startWeekDay": parseInt(this.formProduct.date / 10),
                  "endWeekDay": parseInt(this.formProduct.date % 10),
                  "periods": [{"startTime": this.formProduct.startTime, "endTime": this.formProduct.endTime}]
                }, {
                  "startWeekDay": this.formProduct.date1 ? parseInt(this.formProduct.date1 / 10) : '',
                  "endWeekDay": this.formProduct.date1 ? parseInt(this.formProduct.date1 % 10) : '',
                  "periods": [{"startTime": this.formProduct.startTime1, "endTime": this.formProduct.endTime1}]
                }]),
                contact: this.formProduct.contact,
                distribution: this.formProduct.distribution,
                banner: {name: this.formProduct.fileList[0].name, url: this.formProduct.fileList[0].url},
                provinceCode: this.formProduct.provinceCode,
                province: this.province,
                cityCode: this.formProduct.cityCode,
                city: this.city,
                address: this.formProduct.address,
                position: !this.coordinate ? '' : this.coordinate.lng + ',' + this.coordinate.lat
              }
            }
            this.axios.post('/api/curio/add-update', JSON.stringify(curio)).then((response) => {
              if (response.data.code == 0) {
                let string = this.$route.query.id ? '古玩城编辑成功' : '古玩城新增成功';
                this.$message.success({
                  message: string,
                  showClose: true
                });
                this.$router.replace({path: '/antique'})
              }
              else {
                this.$message.error({
                  message: response.data.desc,
                  showClose: true
                });
              }
            }).catch((error) => {
              console.log(error)
            })
          } else {
            console.log('error');
            return false;
          }
        });
      },
      uploadBefore(file) {
        let reg = /.*(.jpg|.png|.gif)$/;//匹配图片格式
        // 限制文件大小 (大图标1M以下)
        if (reg.test(file.name.toLowerCase())) {
          if ((file.size / 1024) > 1024) {
            this.$message.error({
              message: '图片不能超过1M, 请重新上传!',
              showClose: true
            })
            return false
          }
        } else {
          this.$message.error({
            message: '图片格式不正确, 请重新上传!',
            showClose: true
          })
          return false
        }
      },
      handleRemove(file, fileList) {
        this.axios.post('/api/item/picture/delete', JSON.stringify({
          param: {
            url: file.url
          }
        })).then((response) => {
        })
        this.formProduct.fileList = _.difference(this.formProduct.fileList, [file])
      },
      handlePreview(file) {
        window.open(file.url)
      },
      handleSuccess(response, file, fileList){
        this.formProduct.fileList = [{
          name: file.name,
          url: response.result.model
        }]
      },
      handleRemove1(file, fileList) {
        this.axios.post('/api/item/picture/delete', JSON.stringify({
          param: {
            url: file.url
          }
        })).then((response) => {
          if (response.data.code == 0) {
            this.formProduct.businessList = _.difference(this.formProduct.fileList, [file])
          }
        })
      },
      handleSuccess1(response, file, fileList){
        this.formProduct.businessList = [{
          name: file.name,
          url: response.result.model
        }]
      }
    }
  }
</script>
