import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm, Controller } from 'react-hook-form';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const multipleChoice = {
  a: 'I have never done any coding in my life',
  b: 'I have done a couple tutorials on codeAcademy or whatever',
  c: 'I have done more than a couple tutorials. I have actually built something that works',
  d: 'I have built a few small things',
  e: 'I am an actual developer just looking to sharpen my skills',
};

const defaultValues = {
  defaultValues: { email: '', interest: '', plans: '', level: '', pbjChallenge: '' },
};

const ApplicationForm = () => {
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm(defaultValues);

  const sendEmail = async (formData) => {
    const userId = process.env.REACT_APP_EMAIL_JS_USER_ID;
    const serviceId = process.env.REACT_APP_EMAIL_JS_SERVICE_ID;
    const messageParams = { ...formData, 'g-recaptcha-response': captchaValue };

    await emailjs
      .send(serviceId, 'application_form', messageParams, userId)
      .then(() => {
        setShowLoading(false);
        setShowSuccess(true);
      })
      .catch((err) => {
        setShowLoading(false);
        setShowError(true);
        // eslint-disable-next-line no-console
        console.log('Error sending email:', err);
      });
  };

  const onSubmit = (formData) => {
    if (captchaValue) {
      setShowLoading(true);
      sendEmail(formData);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <Container className="application-container">
      <Typography variant="h2" component="div" gutterBottom>
        Application Form
      </Typography>
      <Box
        autoComplete="off"
        className="application-form"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box className="inputs-box">
          <FormLabel component="h1">Email</FormLabel>
          <Controller
            id="application_form"
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                className="input-field email"
                type="email"
                variant="outlined"
                error={!!error}
                helperText={error ? error.message : null}
                {...field}
              />
            )}
            rules={{ required: 'email required' }}
          />
          <FormLabel component="h1">Why are you interested in Access Granted?</FormLabel>
          <Controller
            name="interest"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                className="input-field"
                type="text"
                variant="outlined"
                multiline
                rows={4}
                error={!!error}
                helperText={error ? error.message : null}
                {...field}
              />
            )}
            rules={{ required: 'response required' }}
          />
          <FormLabel component="h1">
            What do you plan to do with the skills you will acquire in this class?
          </FormLabel>
          <Controller
            name="plans"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                className="input-field"
                type="text"
                variant="outlined"
                multiline
                rows={4}
                error={!!error}
                helperText={error ? error.message : null}
                {...field}
              />
            )}
            rules={{ required: 'response required' }}
          />
          <FormControl error={!!errors.level} className="input-field" variant="standard">
            <FormLabel component="h1">What is your current level of coding expertise?</FormLabel>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    className="radio-btn"
                    value={multipleChoice.a}
                    label={multipleChoice.a}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    className="radio-btn"
                    value={multipleChoice.b}
                    label={multipleChoice.b}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    className="radio-btn"
                    value={multipleChoice.c}
                    label={multipleChoice.c}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    className="radio-btn"
                    value={multipleChoice.d}
                    label={multipleChoice.d}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    className="radio-btn"
                    value={multipleChoice.e}
                    label={multipleChoice.e}
                    control={<Radio />}
                  />
                </RadioGroup>
              )}
              rules={{ required: 'please select an option' }}
            />
            {errors.level && <FormHelperText>{errors.level.message}</FormHelperText>}
          </FormControl>
          <FormLabel component="h1">
            Please instruct me, <b> in as much detail as possible, </b> on all the steps involved in
            making a Peanut Butter and Jelly sandwich. Assume I am standing in front of a table with
            a jar of Peanut Butter, a jar of Jelly, a loaf of sliced bread in a bag, a knife, and a
            plate. All jars are closed and the bag of bread is twisted closed and secured with a
            twisty tie. Also assume that I am an idiot and I will do absolutely nothing that you do
            not tell me to do and that I have no common sense whatsoever and will infer nothing.
          </FormLabel>
          <Controller
            name="pbjChallenge"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                className="input-field"
                type="text"
                variant="outlined"
                multiline
                rows={4}
                error={!!error}
                helperText={error ? error.message : null}
                {...field}
              />
            )}
            rules={{ required: 'response required' }}
          />
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RRECAPTCHA_SITE_KEY}
            onChange={(value) => setCaptchaValue(value)}
          />
        </Box>
        <Button type="submit" size="large" variant="outlined" endIcon={<SendIcon />}>
          SUBMIT
        </Button>
      </Box>
      <Snackbar open={showWarning} autoHideDuration={6000} onClose={() => setShowWarning(false)}>
        <Alert severity="warning">Please confirm you are not a robot!</Alert>
      </Snackbar>
      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success">Your application is on it&apos;s way!</Alert>
      </Snackbar>
      <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
        <Alert severity="error">Oops! Something went wrong, please try again.</Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default ApplicationForm;
