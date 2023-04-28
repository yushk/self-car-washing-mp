<script>
import { getToken, setToken, removeToken } from "@/utils/auth";
	export default {
		onLaunch: async function() {
			console.log('App Launch')
			// student
			// setToken('Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI0MzE5NDk5MDUsImlzcyI6ImNsb3Vkc3RvbmUuY29tIiwibmJmIjoxNjc1MDg1OTA1LCJDbGllbnRJRCI6IiIsIklEIjoibzVYSVc0OUZtcU9DWkl5RUd1WXBLNHQ2MVQwYyIsIk5hbWUiOiJzdHVkZW50IiwiUm9sZSI6InN0dWRlbnQifQ.WJeTrN562ZHEYXId5Z8JjdqWE7nui72RIbNFTHMFw9b79SuEASUEy7b9LFspI9U8_ETsP1glZOz5I-b4JSoTveTBdp4kkCMNv-qkkeFOi67GEd-y4xesrJX_PvPY_7NslE71WQG2uAcs_bsA4j6WCM8rAAR2NscE5EAEQavI8LJkUgSUg1QWgK2UGpoAv2F6ReYtkhkDir3JyuaobfkgeapUCGx6Z8RznG709rsQAPLeLVXedM_JxLUBKJIaZHccFsXu9AUYui1X-MW3PIuERtwPvTD6WJGP2qXi6DSCZpfK5-VdzIqKUjsSM8Ogl39PvpOS2CAgJIcDJJ16hSdhjw')
			// root
			// setToken('Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI0MjAzNjU4MjIsImlzcyI6ImNsb3Vkc3RvbmUuY29tIiwibmJmIjoxNjYzNTAxODIyLCJDbGllbnRJRCI6IiIsIklEIjoiY2M5aGluM3VodXIyMXM2bmxqN2ciLCJOYW1lIjoia2Fpc2F3aW5kIiwiUm9sZSI6InJvb3QifQ.pWbLTPg7VXXuDQv2uCVxOStsxt9y9X8E1eJ6LAaJnynLrcbz_NQSdQsLx7hF3uam-7eXD1N-w6jJGeG3-YxW4sTJXXRarXFzKXESG7ZMnZeuDTyd3j8wEUj2rwW_QuYmF9XBpt1NCfMuPtONU00jr0FbveSpcBx3PWvTEyDbUYycXX7q8EdfqzqrY2flh_wmRFL3z68to2NJguYNM5YNy86pKvEpHBPVc_rrErRAuw5ocRhOSS9MyjYrDFLJIm3L8dTQPrJsROeqGVpi8uL2Bx2Gtob92F94lB_JNqtWLeJN-HSXPhQwX7wGN2SwCTuz3TLnlD_yH-Ig3S6RtX6gZQ')
			// teacher
			// setToken('Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI0MzE5NDk5NjgsImlzcyI6ImNsb3Vkc3RvbmUuY29tIiwibmJmIjoxNjc1MDg1OTY4LCJDbGllbnRJRCI6IiIsIklEIjoiY2YwYzRyNDY0Y25zNzNjZmxpMTAiLCJOYW1lIjoi5LqO6ICB5biIIiwiUm9sZSI6InRlYWNoZXIifQ.nvTnYIN0T3DN_pQgE5bcUvsd9FBKF2PSaosXuTyqmpyoxoSqsp7jwP6VqqG0F5Za6-gEHmDY9OV2P0J41pge7mSh02fNQsR1j4OPjwunKTawxziwl-qKbAutbhzey-v7ezfMHTmA2FEX-6eXOBuJm94BGKBpVwH6Pt8QqS2EE4a2FkURiXERRydajmyOG6iggdZwCCpyfjZVxhzqCFb5jtC4S6eLj3VtrC8TggKeAzfox9TRHoULSAAnVzDm5aB7tgJvMbsQRhRuqMRVd4bj7WBhYgCgtsTMf40F4LsWpP8m5Y0bBx3leeiVveGXR3pQVpmiMsbVDNlSwK5FodT6jQ')
			let token =getToken() 
			console.log('token:',token)
			if(token){
				try{
					this.$store.dispatch('user/getInfo').then(res=>{
						if(res.role){
							uni.reLaunch({url:'/pages/home/index'})
						}else{
							// uni.reLaunch({url:'/pages/login/bind_userinfo'})
							uni.reLaunch({url:'/pages/login/login'})
						}
					},err=>{
					})
				}catch(err){
					uni.reLaunch({url:'/pages/login/login'})
				}
			}else{
				uni.reLaunch({url:'/pages/login/login'})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "style/page.scss";
</style>
