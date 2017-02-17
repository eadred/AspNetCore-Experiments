using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcTest.Services.ModelBinding
{
    public class FormItemModelConvention : IActionModelConvention
    {
        public void Apply(ActionModel action)
        {
            //This only gets executed on starting the application
            var allParams = action.Parameters
                .Select(p => new { ParameterModel = p, FormItemName = p.Attributes.OfType<FormItemAttribute>().FirstOrDefault()?.ItemName })
                .Where(t => !string.IsNullOrEmpty(t.FormItemName));

            foreach (var param in allParams)
            {
                param.ParameterModel.BindingInfo = param.ParameterModel.BindingInfo ?? new BindingInfo();
                var bindingInfo = param.ParameterModel.BindingInfo;
                bindingInfo.BinderType = typeof(FormItemModelBinder);
                bindingInfo.BindingSource = BindingSource.Form;
                bindingInfo.BinderModelName = param.FormItemName;
            }
        }
    }
}
