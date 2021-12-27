@extends('layouts.admin')

@section('title')
    Credits System
@endsection

@section('content-header')
    <h1>Credits System<small>Configure the credits system.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Credits</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Credits System Settings</h3>
                </div>
                <form action="{{ route('admin.credits') }}" method="POST">
                    <div class="box-body">
                        <div class="form-group col-md-4">
                            <label class="control-label">Active</label>
                            <div>
                                <select name="config:enabled" class="form-control">

                                </select>
                                <p class="text-muted"><small>Cam edit this lol.</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
