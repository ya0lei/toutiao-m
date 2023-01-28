// 坑:大数字问题,js只能处理-2^53到2^53之间(不含两个端点)的数字,超出会有误差
//解决方案:
//描述:某某项目,后端返回了一系列的数据,其中有id,我们需要id请求详细的数据,发送id到服务器后,一直返回404,说明请求路径有问题,跟后端确认过,数据没有问题,后来查文档发现,后端给的数据超出了咱们前端能显示的最大范围
// 解决问题: // 1.用json-bigint第三方包来解决 //
2.我们的是axios,他会把后端给的数据自动转成对象格式的(用的JSON.parse自带的方法,有大数字的问题)
//
3.从数据的源头来解决大数字问题,在axios配置项transformResponse内,修改代码为jsonBig.parse(data)即可,jsonBig是通过import导入的
<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="status === 0">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div
        class="article-detail markdown-body"
        v-else-if="status === 1"
        ref="article-content"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 父组件传递关注状态true||false -->
          <FollowUser
            class="follow-btn"
            :isFollowed.sync="article.is_followed"
            :autId="article.aut_id"
          ></FollowUser>
          <!-- 这玩意改成组件 -->
          <!-- <van-button
            v-if="article.is_followed"
            @click="onFollow"
            :loading="followLoading"
            class="follow-btn"
            round
            size="small"
            >已关注</van-button
          >
          <van-button
            v-else
            @click="onFollow"
            :loading="followLoading"
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content" v-html="article.content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <!-- @reply-click="onReplyClick" -->
        <comment-list
          :source="article.art_id"
          :totalCount.sync="totalCommentCount"
          :key="num"
          @open="open"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <!-- 收藏 -->
          <!-- <van-icon color="#777" name="star-o" /> -->
          <CollectArticle
            :value.sync="article.is_collected"
            :artId="article.art_id"
          ></CollectArticle>
          <!-- 点赞 -->
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <LikeArticle
            :value.sync="article.attitude"
            :artId="article.art_id"
          ></LikeArticle>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- 底部写评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost
            :target="article.art_id"
            @onPostSuccess="onPostSuccess"
          ></CommentPost>
        </van-popup>
        <!-- /底部写评论弹出层 -->
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="status === 2">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else-if="status === 3">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle()"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <CommentReply
        v-if="isReplyShow"
        @close="isReplyShow = false"
      ></CommentReply>
    </van-popup>
    <!-- /评论回复弹出层 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant' // 导入预览插件
import FollowUser from '@/components/follow-user' // 引入关注按钮组件
import CollectArticle from '@/components/collect-article' // 引入收藏组件
import CommentList from './components/comment-list' // 引入评论组件
import LikeArticle from '@/components/like-article' // 引入点赞组件
import CommentPost from './components/comment-post' // 引入发表文章评论组件
import CommentReply from './components/comment-reply' // 评论回复内容组件
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    CommentList,
    LikeArticle,
    CommentPost,
    CommentReply
  },
  // 给所有的后代组件提供数据
  // 注意：不要滥用,非响应式的
  // provide: function () {
  //   return {
  //     articleId: this.articleId // 或者写成 this.$route.params.articleId  也可以
  //   }
  // },
  // 大熊写法
  provide () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    // 使用props获取动态路由的数据
    articleId: {
      // 用户点击拿到id是数字,用户直接在地址栏输入id是字符
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 2.定义变量存储文章详情
      status: 0, // 0:加载中,1:加载完成 2:加载失败:404 3:加载失败:未知错误
      followLoading: false, // 控制是否处于载中
      totalCommentCount: 0, // 文章评论总数量
      isPostShow: false, // 发布评论弹层控制
      num: 1, // key值
      isReplyShow: false // 回复评论的弹出层显示状态
    }
  },
  computed: {},
  watch: {
    // 监听vuex数据comment的变化,做出相应的处理
    // 这样写有bug,数据不改变,回复弹框不触发
    // '$store.state.comment' () {
    //   this.isReplyShow = true
    // }
  },
  created () {
    // 调用获取文章数据
    this.loadArticle()
  },
  mounted () {},
  methods: {
    // 封装获取文章数据
    async loadArticle () {
      // 加载资源显示加载
      this.status = 0
      try {
        // 写一个1到10的随机数
        // if (Math.floor(Math.random() * 10) > 7) {
        //   return 我来一个语法错误好吧
        // }
        // 3.1 发送请求
        const { data } = await getArticleById(this.articleId)
        // 3.3 成功赋值
        this.article = data.data
        console.log(this.article) // 控制台查看数据输出
        // 服务器成功响应,让status=1
        this.status = 1
        // 初始化图片点击预览
        console.log(this.$refs['article-content']) // 这里没有内容
        // 这个时候其实找不到 这个refs引用的，原因是因为v-if的渲染其实需要时间，我们视图还没有立即更新完成。
        // 使用定时器，延迟更新( setTimeout 0 会把要做的事情放在异步队列的最后面执行！ )
        setTimeout(() => {
          console.log(this.$refs['article-content']) // 这里有内容
          this.previewImage()
        }, 0)
        // 不使用定时器可以使用nextTick这个api方法
        // this.loading = false
        // this.$nextTick(()=>{
        //     this.previewImage()
        // })
      } catch (err) {
        // catch会捕获400错误,500错误,语法错误
        // 3.2 失败处理
        console.dir(err)
        if (err.response && err.response.status === 404) {
          // 404错误
          this.status = 2
        } else {
          // 未知错误
          this.status = 3
        }
      }
    },
    // 预览图片处理事件函数
    previewImage () {
      // 得到所有的 img 节点,获取所有图片
      const articleContent = this.$refs['article-content'] // 获取到了容器节点
      const imgs = articleContent.querySelectorAll('img')

      // 获取所有 img 地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)

        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          // 循环结束之后调用组件展现图片
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 点击哪个图片就显示那个图片
            startPosition: index
          })
        }
      })
    },
    // 自定义事件,控制弹出层消失,让key值变化
    onPostSuccess () {
      this.isPostShow = false
      this.num++
      // 用v-if来刷新当前组件
      // this.isPostShow = false
      // this.show = false // 让评论列表组件销毁
      // this.$nextTick(() => {
      //   this.show = true // 让评论列表展现
      // })
    },
    // onReplyClick (obj) {
    //   // 打开弹层
    //   this.isReplyShow = true
    //   console.log(obj)
    // },
    // 控制回复弹框的出现
    open () {
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
button {
  border: 0px;
}
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 60px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/ .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  /deep/ .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
