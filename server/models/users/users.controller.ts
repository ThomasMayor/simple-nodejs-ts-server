import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { helperController } from '../helper.controller';
import { User, IUserModel } from './user.model';

// Import config
import { SECRET_TOKEN_KEY, BCRYPT_ROUND, PASSWORD_MIN_LENGHT, JWT_EXPIRE} from "../../config";



export const userController = {
  // Route to add mokup user in MongoDB
  /*
    User connection info:
      email:  aa@aa.ch
      pwd:    A123456
  */
	setup : (req:any,res:any) => {
    // Use bcrypte to encrypte user password
    bcrypt.hash('A123456', BCRYPT_ROUND, (err, hash) =>{
      if(err){
        console.log('User saved successfully');
        res.json({ success: false, message: 'Error with bcrypt hash password' });
        return
      }
      // Store hash in your password DB.
      // create a sample user
      //(new User(<IUserModel>req.body))
      var newuser = <IUserModel>new User({
        email: 'aa@aa.ch',
        name: 'Thomas Mayor',
        password: hash,
        admin: true,
        created: new Date(),
        profilePicture: '',
      });
      newuser.save((err, doc:IUserModel) => {
  			if(err) {
          console.log('save user mokup-> ',err)
          res.json({ success: false, message: 'Error with save user mokup' });
          return;
        };
        console.log('User saved successfully');
        res.json({ success: true, user: newuser.toJSON() });
  		})
    });
	},

	signup : (req:any,res:any) =>{
		//(new User(<IUserModel>req.body))
    // check existe user in DB
    // before add new user
    // find the user



    User.findOne({email: req.body.email}, (err, user:IUserModel)=> {
      if (err) throw err;
      if (!user) {
        // No existing user found, create the new user
        // Check password length is >= 6
        if(req.body.password.length < PASSWORD_MIN_LENGHT) {
          res.json({ success: false, message: `Error password require min ${PASSWORD_MIN_LENGHT} characters` });
          return
        }
        // Use bcrypte to encrypte user password
        bcrypt.hash(req.body.password, BCRYPT_ROUND, (err, hash) =>{
          if(err){
            console.log('Error with bcrypt hash password', err);
            res.json({ success: false, message: 'Error with bcrypt hash password' });
            return
          }
          // create user
          var newuser = <IUserModel>new User({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            admin: false,
            created: new Date(),
            profilePicture: '',
          });
          newuser.save((err, doc:IUserModel) => {
      			if(err) return console.log(err);
            console.log('User created successfully');
            let token = jwt.sign(newuser.toJSON(), SECRET_TOKEN_KEY, {
              expiresIn: JWT_EXPIRE // expires in 24 hours
            });
            res.json({ success: true, message: 'User created successfully', token: token });
      		})
        })

      }
      else {
        // User alerady existe un DB
        res.json({ success: false, message: 'User already exists'});
      }
    });
  },

  isAuth: (req:any,res:any)=> {
    let token = jwt.sign(req.authUser.toJSON(), SECRET_TOKEN_KEY, {
      expiresIn: JWT_EXPIRE // expires in 24 hours
    });
    res.json({ success: true, message: 'JWT is correct', token: token});
  },

  auth: (req:any,res:any)=> {
    // find the user
    User.findOne({email: req.body.email}, (err, user:IUserModel)=> {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      }
      else if (user) {
        // check if password matches
        // Load hash from your password DB.
        // Use bcrypte to compare user password with hash
        bcrypt.compare(req.body.password, user.password, (err, result)=> {
            // res == true
            if(err){
              console.log('Authentication failed. Error with password comparaison.', err);
              res.json({ success: false, message: 'Authentication failed. Error with password.' });
              return;
            }
            if (result === false) {
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }
            else if (result === true){
              // if user is found and password is right
              // create a token
              let token = jwt.sign(user.toJSON(), SECRET_TOKEN_KEY, {
                expiresIn: JWT_EXPIRE // expires in 24 hours
              });

              // return the information including token as JSON
              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });
            }
            else {
              res.json({ success: false, message: 'Authentication failed. Error with compare password: res-> ' + result });
              return;
            }

        });
      }
    });
  },

  getAll : (req:any,res:any) => {
		User.find((err, docs:IUserModel[]) => {
			if(err) return console.log(err);
      let docsReady = docs.map((user)=> user.toJSON());
			res.json(docsReady);
		})
  },

  getUser: (req:any,res:any) => {
    res.json(req.user.toJSON());
  },

  checkNameEmailExists: (email: string, name: string, id?: any): Promise<{ nameExists: boolean, emailExists: boolean }> => {
    return new Promise((resolve, reject) => {
      User.find( { $or: [ { email: email }, { name: name } ] } )
          .then((docs: any) => {
            let result = { nameExists: false, emailExists: false };
            if (docs.length) {
              docs.forEach((user:any) => {
                if (id && user._id.toString() == id.toString())
                  return;
                if (user.email == email)
                  result.emailExists = true;
                if (user.name == name)
                  result.nameExists = true;
              });
            }
            resolve(result);
          })
          .catch(reject);
    })
  },


  patchUser: (req:any, res:any) => {
    let user:IUserModel = req.user;
    if (!req.authUser.admin && req.authUser._id != user._id) {
      return res.status(403).send({success: false, message: "Vous n'avez pas le droit de modifier cet utilisateur."});
    }

    if (req.body) {
      let email = req.body.email ? req.body.email : 'NotAnEmail';
      let name = req.body.name ? req.body.name : '';
      // HACK : this.checkNameEmailExists is undefined
      userController.checkNameEmailExists(email, name, user._id)
          .then((result:any) => {
            if (result.emailExists || result.nameExists) {
                let msg = '';
               if (result.emailExists && result.nameExists) {
                 msg = "L'email et le nom sont déjà utilisés.";
               }
               else if (result.nameExists) {
                 msg = "Le nom est déjà utilisé.";
               }
               else {
                 msg = "L'email est déjà utilisé.";
               }

               return res.send({success: false, message: msg});
            }
            if (req.body.email)
              user.email = req.body.email;
            if (req.body.name)
              user.name = req.body.name;
            if (req.body.profilePicture)
              user.profilePicture = req.body.profilePicture;


            const callback = (err:any, hash:string) => {
              if(err){
                console.log('Error with bcrypt hash password', err);
                helperController.handleError(req, res, 'Error with bcrypt hash password');
                return
              }
              if (hash) {
                user.password = hash;
              }

              user.save((err:any, doc:IUserModel) => {
          			if(err)
                  helperController.handleError(req, res, err);
                else {
                  let result: any = { success: true, message: 'User created successfully' };
                  //if for current logged in user, generate new token
                  if (user._id == req.authUser._id) {
                    let token = jwt.sign(user.toJSON(), SECRET_TOKEN_KEY, {
                      expiresIn: JWT_EXPIRE // expires in 24 hours
                    });
                    result.token = token;
                  }
                  else {
                    result.user = user.toJSON();
                  }
                  res.json(result);
                }
          		})

            }

            if (req.body.password) {
              bcrypt.hash(req.body.password, BCRYPT_ROUND, callback);
            }
            else {
              callback('','');
            }




          });
    }
    else
      helperController.handleError(req, res, 'Requête invalide', 400);
  },


  checkJWT: (req:any, jwtuser:any, next:any) => {
    User.findById(helperController.toObjectId(jwtuser._id)).then(user => {
      if (!user) {
        next(null, false);
       } else {
        req.authUser = user;
        next(null, user);
      }
    }).catch(next)
  },

  checkUID: (req:any, res:any, next:any, uid:any) => {
    User.findById(helperController.toObjectId(uid)).then(user => {
        if (!user) {
            return res.status(404 /* Not Found */).send();
        } else {
            //add user to request
            req.user = user;
            return next();
        }
    }).catch(next);
  }
}
