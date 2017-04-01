#Hippo CMS RESTful API reference
This is the Hippo CMS REST API reference

License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)



BasePath: http://host:port/cms/rest/api

Api Version: 0.3

## APIs
### /nodes
#### Overview
JCR node API

#### **GET** `/nodes{path:.*}`
##### getNodeByPath 

Get a node
Returns a node from the specified path

###### URL
http://host:port/cms/rest/api/nodes{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the node to retrieve</td>
        <td>string</td>
    </tr>
</table>
- query

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>depth</th>
        <td>false</td>
        <td>Depth of the retrieval</td>
        <td>int</td>
    </tr>
</table>

###### Response
[node](#node)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 200    | OK | [node](#node) |
| 401    | Unauthorized | - |
| 404    | Node not found | - |
| 500    | Error occurred | - |


- - -
#### **POST** `/nodes{path:.*}`
##### createNodeByPath 

Creates a new sub node
Adds a node and it's properties as a child of the provided location

###### URL
http://host:port/cms/rest/api/nodes{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the node to which to add the new node e.g. &#39;/content/documents/&#39;</td>
        <td>string</td>
    </tr>
</table>
- body

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>body</th>
        <td>false</td>
        <td></td>
        <td><a href="#node">node</a></td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 200    | OK | - |
| 201    | Created | - |
| 400    | Request not understood due to errors or malformed syntax | - |
| 401    | Unauthorized | - |
| 404    | Node not found | - |
| 403    | Access denied | - |
| 500    | Error occurred | - |


- - -
#### **PUT** `/nodes{path:.*}`
##### updateNodeByPath 

Update a node
To update a node you need to provide the entire entity. The entity will be replaced with the  provided data. Be careful in case you want to update entire node structures, because the UUIDs will be  regenerated

###### URL
http://host:port/cms/rest/api/nodes{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the node to update. &#39;/content/documents/&#39;</td>
        <td>string</td>
    </tr>
</table>
- body

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>body</th>
        <td>false</td>
        <td></td>
        <td><a href="#node">node</a></td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 200    | OK | - |
| 204    | Updated | - |
| 400    | Request not understood due to errors or malformed syntax | - |
| 401    | Unauthorized | - |
| 404    | Node not found | - |
| 403    | Access denied | - |
| 500    | Error occurred | - |


- - -
#### **DELETE** `/nodes{path:.*}`
##### deleteNodeByPath 

Delete a node
Deletes a node (and child-nodes)

###### URL
http://host:port/cms/rest/api/nodes{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the node to delete e.g. &#39;/content/documents/&#39;</td>
        <td>string</td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 204    | Deleted | - |
| 404    | Node not found | - |
| 500    | Error occurred | - |


- - -
### /properties
#### Overview
JCR property API

#### **GET** `/properties{path:.*}`
##### getPropertyByPath 

Get a property
Returns a property from the specified path

###### URL
http://host:port/cms/rest/api/properties{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the node to retrieve e.g &#39;/content/hippostd:foldertype&#39;.</td>
        <td>string</td>
    </tr>
</table>

###### Response
[property](#property)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 200    | OK | [property](#property) |
| 401    | Unauthorized | - |
| 404    | Node not found | - |
| 500    | Error occurred | - |


- - -
#### **POST** `/properties{path:.*}`
##### createPropertyByPath 

Add a property to a node
Adds a property to a node

###### URL
http://host:port/cms/rest/api/properties{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the node to which to add the property to e.g. &#39;/content/documents/&#39;</td>
        <td>string</td>
    </tr>
</table>
- body

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>body</th>
        <td>false</td>
        <td></td>
        <td><a href="#property">property</a></td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 201    | Created | [property](#property) |
| 401    | Unauthorized | - |
| 404    | Node not found | - |
| 403    | Access denied | - |
| 500    | Error occurred | - |


- - -
#### **PUT** `/properties{path:.*}`
##### updatePropertyByPath 

Updates a property of a node
Updates a property of a node

###### URL
http://host:port/cms/rest/api/properties{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the property to update e.g. &#39;/content/documents/hippostd:foldertypes&#39;</td>
        <td>string</td>
    </tr>
</table>
- body

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>body</th>
        <td>false</td>
        <td></td>
        <td><a href="#property">property</a></td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 204    | Updated | - |
| 401    | Unauthorized | - |
| 404    | Property not found | - |
| 403    | Access denied | - |
| 500    | Error occurred | - |


- - -
#### **DELETE** `/properties{path:.*}`
##### deletePropertyByPath 

Delete a property
Deletes a property

###### URL
http://host:port/cms/rest/api/properties{path:.*}
###### Parameters
- path

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>path</th>
        <td>true</td>
        <td>Path of the property to delete e.g. &#39;/content/hippostd:foldertype&#39;.</td>
        <td>string</td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 204    | Deleted | - |
| 404    | Node not found | - |
| 500    | Error occurred | - |


- - -
### /_query
#### Overview
JCR QUERY API

#### **GET** `/_query/`
##### getResults 

Query for nodes
Returns a list of nodes

###### URL
http://host:port/cms/rest/api/_query/
###### Parameters
- query

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>statement</th>
        <td>true</td>
        <td>JCR valid query syntax. &#39;//element(*,hippo:document) order by @jcr:score descending&#39;</td>
        <td>string</td>
    </tr>
    <tr>
        <th>language</th>
        <td>true</td>
        <td>JCR query language e.g &#39;xpath, sql&#39; or &#39;JCR-SQL2&#39;</td>
        <td>string</td>
    </tr>
    <tr>
        <th>limit</th>
        <td>false</td>
        <td>Sets the maximum size of the result set.</td>
        <td>int</td>
    </tr>
    <tr>
        <th>offset</th>
        <td>false</td>
        <td>Sets the start offset of the result set.</td>
        <td>int</td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 200    | OK | [results](#results) |
| 401    | Unauthorized | - |
| 404    | Node not found | - |
| 500    | Error occurred | - |


- - -
#### **POST** `/_query/`
##### getResults 

Query for nodes
Returns a list of nodes. This method is especially useful when the query exceeds the maximum length of the URL.

###### URL
http://host:port/cms/rest/api/_query/
###### Parameters
- body

<table border="1">
    <tr>
        <th>Parameter</th>
        <th>Required</th>
        <th>Description</th>
        <th>Data Type</th>
    </tr>
    <tr>
        <th>body</th>
        <td>false</td>
        <td></td>
        <td><a href="#search">search</a></td>
    </tr>
</table>

###### Response
[](#)


###### Errors
| Status Code | Reason      | Response Model |
|-------------|-------------|----------------|
| 200    | OK | [results](#results) |
| 401    | Unauthorized | - |
| 404    | Node not found | - |
| 500    | Error occurred | - |


- - -

## Data Types


## <a name="URI">URI</a>

<table border="1">
    <tr>
        <th>type</th>
        <th>required</th>
        <th>access</th>
        <th>description</th>
        <th>notes</th>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>boolean</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>boolean</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>int</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>



## <a name="node">node</a>

<table border="1">
    <tr>
        <th>type</th>
        <th>required</th>
        <th>access</th>
        <th>description</th>
        <th>notes</th>
    </tr>
    <tr>
        <td>Array[string]</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td><a href="#node">Array[node]</a></td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td><a href="#property">Array[property]</a></td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>



## <a name="property">property</a>

<table border="1">
    <tr>
        <th>type</th>
        <th>required</th>
        <th>access</th>
        <th>description</th>
        <th>notes</th>
    </tr>
    <tr>
        <td>boolean</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>Array[string]</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>



## <a name="result">result</a>

<table border="1">
    <tr>
        <th>type</th>
        <th>required</th>
        <th>access</th>
        <th>description</th>
        <th>notes</th>
    </tr>
    <tr>
        <td><a href="#URI">URI</a></td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td><a href="#Map[string,string]">Map[string,string]</a></td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>double</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>



## <a name="results">results</a>

<table border="1">
    <tr>
        <th>type</th>
        <th>required</th>
        <th>access</th>
        <th>description</th>
        <th>notes</th>
    </tr>
    <tr>
        <td>long</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td><a href="#result">Array[result]</a></td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>long</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>



## <a name="search">search</a>

<table border="1">
    <tr>
        <th>type</th>
        <th>required</th>
        <th>access</th>
        <th>description</th>
        <th>notes</th>
    </tr>
    <tr>
        <td>int</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>int</td>
        <td>optional</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>string</td>
        <td>required</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
</table>


