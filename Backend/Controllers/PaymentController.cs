using DoAnTotNghiep.Model;
using DoAnTotNghiep.Model.VnPayModel;
using DoAnTotNghiep.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoAnTotNghiep.Controllers
{

    [Route("api/payment")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly UserManager<AppUser> _userManager;
        public PaymentController(IVnPayService vnPayService, UserManager<AppUser> userManager)
        {
            _vnPayService = vnPayService;
            _userManager = userManager;
        }
        [Authorize]
        [HttpPost("create-payment")]
        public IActionResult CreatePaymentUrlVnpay([FromBody]PaymentRequestModel model)
        {
            var UserName  = User.Identity?.Name;
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext,UserName!);

            return Ok(url);
        }
        [HttpGet("payment-return")]
        public async Task<IActionResult> PaymentReturn()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            if (response.VnPayResponseCode == "00" && response.Success)
            {
                var orderInfo = Request.Query["vnp_OrderInfo"].ToString();
                var parts = orderInfo.Split(' ');
                var userName = parts.Length > 0 ? parts[0] : ""; // bạn cần viết hàm này

                // Cập nhật IsVip = true
                var user = await _userManager.FindByNameAsync(userName);
                if (user != null)
                {
                    user.IsVip = true;
                    await _userManager.UpdateAsync(user);
                }
            }
            return Ok(response);
        }

    }
}
