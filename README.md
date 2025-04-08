# README
This is the frontend for Marcus' shop. 

Check the backend [here](https://github.com/lucassanco/marcus-backend)

##
To run on a container on Docker:

On the directory of the backend

Build the image:

```
docker build -t frontend .
```

Run the container (interactive so that Ctrl-C works): 

```
docker run -it -p 5173:5173 frontend
```

# Landing

Here we can choose if we want the public part of the shop (being a cleint) or the private part (being Marcus)

![image](https://github.com/user-attachments/assets/89f4acdd-7ff1-4f6a-ac28-1585ab52bbe1)

## Public

When we enter the public part, we will see all the Product Types we can buy. 
The next image shows a Product family of Bicycle:

![image](https://github.com/user-attachments/assets/d282d85c-4570-4492-87e1-be32649c63f9)


Clicking on the Eye icon will show all the related Products to that ProductType:

![image](https://github.com/user-attachments/assets/caf966b4-eb74-459a-9241-1ed589fc7ada)

If we click on customize, we can select what options we want for the current product:

![image](https://github.com/user-attachments/assets/8ec12f8a-7196-48cd-b7de-42e1a9acb4b7)S

And then add the product to the Cart if we don't face any constraint:

![image](https://github.com/user-attachments/assets/b52bc969-245f-4fdc-b73a-679cf9ebd6e6)

Facing a constraint looks like this:

https://github.com/user-attachments/assets/b9c99cdc-7dbe-4a53-8743-5227b6fc3b14

If we try to add an item that does not have stock available, we will face an error, before next video I modified Full-suspension so that it is not available:

https://github.com/user-attachments/assets/388cbcba-3643-4739-965f-91224ebc7e26

## Private

The private site of the page mimics the public site but allows to modify any option.

This is the Product Types, where we can create new product types or products associated with it:

![image](https://github.com/user-attachments/assets/6dcf936c-16aa-41a2-ab45-b30b02ae7d52)

This is the Product view, where we can modify (or create) its associated options and constraints:
![image](https://github.com/user-attachments/assets/60574c6b-1c35-495e-b992-f4e6ee11fe4d)
![image](https://github.com/user-attachments/assets/c39e61a1-c78f-4e8a-a868-332966978286)

Editing an Option:

![image](https://github.com/user-attachments/assets/23d2be62-29ef-4077-89b0-507762b1fa8f)

Editing a Constraint:
![image](https://github.com/user-attachments/assets/6bb5c651-287d-4302-84fe-8dc7bb49de78)

