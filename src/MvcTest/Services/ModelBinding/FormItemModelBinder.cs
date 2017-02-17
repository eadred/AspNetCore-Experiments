using Microsoft.AspNetCore.Mvc.ModelBinding;
using MvcTest.Models.Suites;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.ModelBinding
{
    public class FormItemModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var formItemName = bindingContext.ModelName;
            var request = bindingContext.HttpContext.Request;
            //Note that if client side the item json is appended to the form as a blob (as a way of specifying the Content-Type), ie like:
            //
            //fd.append('<name>', new Blob([JSON.stringify(modelToSend)], { type: 'application/json' }), '<blob name>');
            //
            //then the item will be available as an IFormFile in the Request.Form.Files collection
            if (!request.Form.ContainsKey(formItemName))
            {
                bindingContext.Result = ModelBindingResult.Failed();
            }
            else
            {
                var model = JsonConvert.DeserializeObject<Model>(request.Form[formItemName]);
                bindingContext.Result = ModelBindingResult.Success(model);
            }
            
            return Task.CompletedTask;
        }
    }
}
