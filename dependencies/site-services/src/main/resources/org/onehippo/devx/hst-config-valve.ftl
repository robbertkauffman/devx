<#assign hst=JspTaglibs["http://www.hippoecm.org/jsp/hst/core"] >

<@hst.defineObjects />

${hstResponse.setHeader("Content-Type", "application/json")}
${hstResponse.setHeader("Access-Control-Allow-Origin", "*")}

{
    "resolvedSiteMapItem": "${hstRequest.requestContext.resolvedSiteMapItem.hstSiteMapItem.id}",
    "componentConfigurationId": "${hstRequest.requestContext.resolvedSiteMapItem.hstSiteMapItem.componentConfigurationId}",
    <#if hstRequest.requestContext.resolvedSiteMapItem.hstSiteMapItem.relativeContentPath??>
        "relativeContentPath": "${hstRequest.requestContext.resolvedSiteMapItem.hstSiteMapItem.relativeContentPath}",
    </#if>
    "componentConfigurationName": "${hstRequest.requestContext.resolvedSiteMapItem.hstComponentConfiguration.name}",
    "renderPath": "${hstRequest.requestContext.resolvedSiteMapItem.hstComponentConfiguration.renderPath}",
    "components":

<#assign components=hstRequest.requestContext.resolvedSiteMapItem.hstComponentConfiguration.children>
<#if components?has_content>
[
    <@listComponents components/>
]
</#if>

<#macro listComponents components>
    <#list components?keys as component>
    {
    "id": "${component}",
    "name": "${components[component].name}",
    <#--<#if components[component].renderPath??>
        "hst:renderpath": "${components[component].renderPath}",
    </#if>
    <#if components[component].componentClassName??>
        "hst:componentclassname": "${components[component].componentClassName}",
    </#if>-->
        <#if components[component].componentType??>
        "type": "${components[component].componentType}",
        </#if>
        <#if components[component].canonicalStoredLocation??>
        "path": "${components[component].canonicalStoredLocation}",
        </#if>
        <#if components[component].canonicalIdentifier??>
        "uuid": "${components[component].canonicalIdentifier}",
        </#if>
    <#--<#if components[component].parameters?has_content>
        <#assign parameters=components[component].parameters>
        "hst:parameternames": [
            <#list parameters?keys as parameter>
                "${parameter}"<#if !parameter?is_last>, </#if>
            </#list>
        ],
        "hst:parametervalues": [
            <#list parameters?keys as parameter>
                "${parameters[parameter]}"<#if !parameter?is_last>, </#if>
            </#list>
        ],
    </#if>-->
        <#if components[component].children?has_content>
        "nodes": [<@listComponents components[component].children/>]
        <#else>
        "nodes": []
        </#if>
    <#-- TODO: container reference
    <#if components[component].componentType == "COMPONENT">
    <#elseif component.componentType == "CONTAINER_COMPONENT">
        , "reference": "${component.referenceComponent}"
    <#else>
    </#if>-->
    }<#if !component?is_last>,</#if>
    </#list>
</#macro>
}