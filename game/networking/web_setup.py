from networking import networking
from flask import Flask, redirect, url_for, render_template, request, session, jsonify, flash, Blueprint, make_response
from datetime import timedelta
from flask_socketio import SocketIO
import socketio

ip = None
port = None
app = Flask(__name__)
Flask.secret_key = "thisIsReallySecret"
app.permanent_session_lifetime = timedelta(hours=10)
web_socket = SocketIO(app)
server = networking.Sever(ip, port, app, web_socket=web_socket)


